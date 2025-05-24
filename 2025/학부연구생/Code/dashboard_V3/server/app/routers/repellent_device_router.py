from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.Models.repellent_device_model import RepellentDevice

router = APIRouter()

@router.get("/data/repellent_device/")
def get_repellent_device(db: Session = Depends(get_db)):
    return db.query(RepellentDevice).all()
