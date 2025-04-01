from fastapi import APIRouter, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import (Project, Image)
from datetime import datetime
import os

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
# 정적 파일 경로 설정 ("/uploads" 경로에서 파일을 제공)
router.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# 프로젝트 생성 API (스키마 제거)
@router.post("/")
def add_project(project: dict, db: Session = Depends(get_db)):
    new_project = Project(name=project["name"])
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return {"id": new_project.id, "name": new_project.name, "created_at": new_project.created_at}


# 모든 프로젝트 조회 API (스키마 제거)
@router.get("/")
def read_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return [{"id": p.id, "name": p.name, "created_at":p.created_at, "is_completed": p.is_completed, "completed_at": p.completed_at} for p in projects]

# 프로젝트에 업로드 한 이미지 전체 조회
@router.get("/{project_id}")
async def get_images(project_id: int, db: Session = Depends(get_db)):
    # 프로젝트 정보 가져오기
    project = db.query(Project).filter(Project.id == project_id).first()
    
    # 프로젝트가 없을 경우 예외 처리
    if not project:
        raise HTTPException(status_code=404, detail="프로젝트를 찾을 수 없습니다.")

    # 해당 프로젝트의 이미지 목록 가져오기
    images = db.query(Image).filter(Image.project_id == project_id).all()

    return {
        "project_id": project.id,
        "project_name": project.name,  # ✅ 프로젝트 이름 추가
        "images": [
            {"id": image.id, "url": image.url, "favorite": image.is_favorite} for image in images
        ]
    }
    
# 프로젝트 끝나면 저장하기
@router.put('/{project_id}/complete')
async def complete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        return {"status": "error", "message": "프로젝트를 찾을 수 없습니다."}

    project.is_completed = True
    project.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(project)

    return {"status": "success", "project_id": project_id, "is_completed": True}

# 특정 프로젝트 삭제 API (스키마 제거)
@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}