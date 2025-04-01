from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Label, Image
import os

router = APIRouter()

LABEL_DIR = "labels"
os.makedirs(LABEL_DIR, exist_ok=True)  # 라벨 저장 폴더 자동 생성

# 라벨 파일 저장 (라벨 데이터 업데이트, 검수 상태는 기존 파일에서 유지)
@router.post("/upload")
def upload_label(data: dict, db: Session = Depends(get_db)):
    image_id = data.get('image_id')
    labels = data.get('labels')
    project_id = data.get('project_id')
    
    # 이미지 존재 여부 확인
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # 이미지 파일명을 기반으로 라벨 파일명 생성 (확장자 제거)
    image_filename = os.path.splitext(os.path.basename(image.url))[0]
    label_filename = f"{image_filename}.txt"
    file_path = os.path.join(LABEL_DIR, label_filename)
    
    # 기존 파일이 있으면 첫 줄(inspection)을 유지, 없으면 기본값 0 사용
    inspection_value = 0
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            first_line = f.readline().strip()
        try:
            inspection_value = int(first_line)
        except Exception:
            inspection_value = 0
    
    # YOLO 형식으로 변환하여 저장할 내용 구성 (첫 줄은 검수 상태)
    label_lines = [str(inspection_value)]
    if labels and len(labels) > 0:
        label_lines += [
            f"{label['class_id']} {label['x_center']} {label['y_center']} {label['width']} {label['height']}"
            for label in labels
        ]
    
    # 파일 저장 (기존 파일이 있으면 삭제 후 새로 기록)
    if os.path.exists(file_path):
        os.remove(file_path)
    with open(file_path, 'w') as f:
        f.write("\n".join(label_lines))
    
    # DB 업데이트: 기존 레코드가 있으면 UPDATE, 없으면 CREATE
    existing_label = db.query(Label).filter(Label.image_id == image_id).first()
    if existing_label:
        existing_label.label_data = file_path
        existing_label.project_id = project_id
        db.commit()
        db.refresh(existing_label)
        return {"message": "Label updated successfully", "file_path": file_path}
    else:
        new_label = Label(image_id=image_id, label_data=file_path)
        db.add(new_label)
        db.commit()
        db.refresh(new_label)
        return {"message": "Label uploaded successfully", "file_path": file_path}

# 검수 상태 업데이트 전용 엔드포인트
@router.patch("/update-inspection")
def update_inspection(data: dict, db: Session = Depends(get_db)):
    image_id = data.get("image_id")
    inspection = data.get("inspection")
    if image_id is None or inspection is None:
        raise HTTPException(status_code=400, detail="Missing image_id or inspection")
    
    # 이미지 존재 여부 확인
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image_filename = os.path.splitext(os.path.basename(image.url))[0]
    label_filename = f"{image_filename}.txt"
    file_path = os.path.join(LABEL_DIR, label_filename)
    
    # 파일이 존재하면 첫 줄만 수정, 없으면 새 파일 생성
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            lines = f.readlines()
        if len(lines) > 0:
            lines[0] = str(inspection) + "\n"
        else:
            lines = [str(inspection) + "\n"]
        with open(file_path, 'w') as f:
            f.writelines(lines)
    else:
        with open(file_path, 'w') as f:
            f.write(str(inspection) + "\n")
    
    return {"message": f"Inspection updated to {inspection} for image {image_id}"}

# 라벨 데이터 가져오기 (검수 상태 포함)
@router.get("/{image_id}")
def get_labels(image_id: int, db: Session = Depends(get_db)):
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image_filename = os.path.splitext(os.path.basename(image.url))[0]
    label_filename = f"{image_filename}.txt"
    file_path = os.path.join(LABEL_DIR, label_filename)
    
    if not os.path.exists(file_path):
        return {"inspection": 0, "labels": []}
    
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    try:
        inspection = int(lines[0].strip())
    except Exception:
        inspection = 0
    
    labels = []
    for line in lines[1:]:
        parts = line.strip().split(" ")
        if len(parts) == 5:
            labels.append({
                "class_id": int(parts[0]),
                "x_center": float(parts[1]),
                "y_center": float(parts[2]),
                "width": float(parts[3]),
                "height": float(parts[4]),
            })
    return {"inspection": inspection, "labels": labels}

@router.put("/{image_id}")
def update_label(image_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # 원본 파일명 유지
    original_filename = file.filename
    file_path = os.path.join(LABEL_DIR, original_filename)  # 원본 파일명 유지
    
    # 기존 라벨이 있는지 확인
    label = db.query(Label).filter(Label.image_id == image_id).first()
    if not label:
        raise HTTPException(status_code=404, detail="Label not found for this image")
    
    # 기존 파일 삭제 후 새 파일 저장
    if os.path.exists(label.label_data):
        os.remove(label.label_data)
    
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    # DB 라벨 경로 업데이트
    label.label_data = file_path
    db.commit()
    db.refresh(label)
    
    return {"message": "Label updated successfully", "file_path": file_path}

@router.delete("/{image_id}")
def delete_label(image_id: int, db: Session = Depends(get_db)):
    label = db.query(Label).filter(Label.image_id == image_id).first()
    if not label:
        raise HTTPException(status_code=404, detail="Label not found for this image")
    
    # 파일 삭제
    file_path = label.label_data
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # DB에서 삭제
    db.delete(label)
    db.commit()
    
    return {"message": "Label deleted successfully"}
