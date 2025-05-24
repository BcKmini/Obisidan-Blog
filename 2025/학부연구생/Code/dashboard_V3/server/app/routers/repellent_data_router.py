from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.Models.repellent_data_model import RepellentData

router = APIRouter()

@router.get("/data/repellent_data/")
def get_repellent_data(db: Session = Depends(get_db)):
    return db.query(RepellentData).all()
