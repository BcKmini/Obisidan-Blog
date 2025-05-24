from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import RepellentData, RepellentDevice, RepellentSound

router = APIRouter()

# 엔드포인트: 모든 데이터 가져오기
@router.get("/data/repellent_data/")
def get_repellent_data(db: Session = Depends(get_db)):
    return db.query(RepellentData).all()

@router.get("/data/repellent_device/")
def get_repellent_device(db: Session = Depends(get_db)):
    return db.query(RepellentDevice).all()

@router.get("/data/repellent_sound/")
def get_repellent_sound(db: Session = Depends(get_db)):
    return db.query(RepellentSound).all()