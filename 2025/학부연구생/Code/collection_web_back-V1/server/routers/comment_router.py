# server/routers/comment_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models.observation import Observation
from models.comment import Comment
from schemas.comment_schema import CommentRead, CommentCreate

router = APIRouter(prefix="/comments", tags=["comments"])

@router.get("/{observation_id}", response_model=list[CommentRead])
def get_comments_for_observation(observation_id: int, db: Session = Depends(get_db)):
    """
    observation_id에 해당하는 댓글 리스트를 조회
    """
    obs = db.query(Observation).filter(Observation.id == observation_id).first()
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")
    
    comments = db.query(Comment).filter(Comment.observation_id == observation_id).all()
    return comments

@router.post("/", response_model=CommentRead)
def create_comment(comment_data: CommentCreate, db: Session = Depends(get_db)):
    """
    새로운 댓글을 등록하는 엔드포인트
    """
    obs = db.query(Observation).filter(Observation.id == comment_data.observation_id).first()
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")

    new_comment = Comment(
        observation_id=comment_data.observation_id,
        username=comment_data.username,
        content=comment_data.content
    )
    db.add(new_comment)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    db.refresh(new_comment)
    return new_comment
