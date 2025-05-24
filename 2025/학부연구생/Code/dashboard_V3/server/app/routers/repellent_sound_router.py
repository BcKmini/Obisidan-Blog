from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.Models.repellent_sound_model  import RepellentSound

router = APIRouter()

@router.get("/data/repellent_sound/")
def get_repellent_sound(db: Session = Depends(get_db)):
    return db.query(RepellentSound).all()
