from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
import uuid
import os
import shutil
from pathlib import Path
import requests

from ..database import get_db
from ..models import Image

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# =================================================
# (1) 디렉토리 내 파일 목록 조회 API (/list?dir=...)
#    *** CHANGED: 기존엔 아래쪽에 선언했으나, 이제 최상단으로 이동 ***
# =================================================
@router.get("/list")
def list_directory_files(
    dir: str = Query(..., description="서버 내 디렉토리 경로"),
    db: Session = Depends(get_db)
):
    if not os.path.isdir(dir):
        raise HTTPException(
            status_code=400,
            detail=f"Directory not found or not a directory: {dir}"
        )
    try:
        files_in_dir = os.listdir(dir)
        # *** CHANGED: 절대 경로 생성 ***
        absolute_paths = []
        for f in files_in_dir:
            full_path = os.path.join(dir, f)
            # 필요 시 파일인지, 확장자 필터링
            if os.path.isfile(full_path):
                absolute_paths.append(full_path)

        return {"files": absolute_paths}

        # *** 원래 코드 (주석):
        # files_in_dir = os.listdir(dir)
        # return {"files": files_in_dir}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading directory: {e}"
        )

# =================================================
# (2) 프로젝트별 이미지 전체 조회
#    *** 원래 이 라우터가 /list 위에 선언되어 있었으나, 충돌 방지를 위해 아래로 이동 ***
# =================================================
@router.get("/{project_id}")
async def get_images(project_id: int, db: Session = Depends(get_db)):
    images = db.query(Image).filter(Image.project_id == project_id).all()
    return [{"id": image.id, "url": image.url} for image in images]

# # *** 원본 (주석처리 예시):
# @router.get("/{project_id}")
# async def get_images_old(project_id: int, db: Session = Depends(get_db)):
#     images = db.query(Image).filter(Image.project_id == project_id).all()
#     return [{"id": image.id, "url": image.url} for image in images]


# ================================
# (원본) 이미지 업로드 API (로컬 파일 업로드)
# ================================
@router.post("/{project_id}")
def upload_image(project_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_ext = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    new_image = Image(project_id=project_id, url=file_path)
    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    return {"images": [{"id": new_image.id, "url": new_image.url}]}


# ================================
# gpu 서버에서 이미지 받아오기
# ================================
SERVER_URL = 'http://10.108.90.20'
GPU_SERVER_URL = 'http://10.108.90.21:8000'
IMG_UPLOAD_DIR = Path('/home/kku/labeling/server/uploads')
IMG_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post('/{project_id}/fetch-gpu')
async def fetch_image_from_gpu(project_id: int, filename: str, db: Session = Depends(get_db)):
    gpu_image_url = f"{GPU_SERVER_URL}/images/{filename}"
    response = requests.get(gpu_image_url, stream=True)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="GPU 서버에서 이미지 다운로드 실패")
    
    file_path = IMG_UPLOAD_DIR / filename
    with file_path.open('wb') as buffer:
        shutil.copyfileobj(response.raw, buffer) # GPU 서버에서 받은 이미지를 70 서버 저장
    
    new_image = Image(project_id=project_id, url=str(file_path))
    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    return {
        "filename": filename,
        "local_url": f"{SERVER_URL}/images/{filename}"
    }



# ================================
# (원본) 단일 서버 경로 import 예시
# ================================
class ImportImage(BaseModel):
    path: str

@router.post("/{project_id}/import")
def import_image(project_id: int, data: ImportImage, db: Session = Depends(get_db)):
    if not os.path.exists(data.path):
        raise HTTPException(status_code=400, detail="File not found at specified path")

    file_ext = data.path.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    dest_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(data.path, "rb") as src_file:
            with open(dest_path, "wb") as dst_file:
                dst_file.write(src_file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to copy file: {e}")

    new_image = Image(project_id=project_id, url=dest_path)
    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    return {
        "images": [{
            "id": new_image.id,
            "url": new_image.url,
            "name": os.path.basename(new_image.url),
        }]
    }


# *** CHANGED START (A): 다중 서버 경로 import (paths: List[str]) ***
class ImportImages(BaseModel):
    paths: List[str]

@router.post("/{project_id}/import-multi")
def import_images_multi(project_id: int, data: ImportImages, db: Session = Depends(get_db)):
    """
    여러 개의 서버 경로를 한꺼번에 등록 (paths: List[str]).
    """
    created_images = []
    for path in data.paths:
        if not os.path.exists(path):
            raise HTTPException(status_code=400, detail=f"File not found: {path}")

        file_ext = path.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        dest_path = os.path.join(UPLOAD_DIR, unique_filename)

        try:
            with open(path, "rb") as src_file:
                with open(dest_path, "wb") as dst_file:
                    dst_file.write(src_file.read())
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to copy file from {path}: {e}")

        new_image = Image(project_id=project_id, url=dest_path)
        db.add(new_image)
        db.commit()
        db.refresh(new_image)

        created_images.append({
            "id": new_image.id,
            "url": new_image.url,
            "name": os.path.basename(new_image.url),
        })

    return {"images": created_images}
# *** CHANGED END (A) ***


# *** CHANGED START (C): 기존 레코드의 project_id만 변경 (재할당) 엔드포인트
class MoveImage(BaseModel):
    new_project_id: int

@router.patch("/{image_id}/move")
def move_image_to_new_project(image_id: int, data: MoveImage, db: Session = Depends(get_db)):
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    image.project_id = data.new_project_id
    db.commit()
    db.refresh(image)

    return {
        "message": "Project ID updated successfully",
        "image": {
            "id": image.id,
            "project_id": image.project_id,
            "url": image.url
        }
    }
# *** CHANGED END (C) ***


# 특정 이미지 삭제 API
@router.delete("/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db)):
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    file_path = os.path.join(UPLOAD_DIR, os.path.basename(image.url))
    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(image)
    db.commit()
    return {"message": "Image deleted successfully"}
