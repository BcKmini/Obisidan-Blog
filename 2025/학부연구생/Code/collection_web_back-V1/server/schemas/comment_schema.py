# schemas/comment_schema.py
from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    observation_id: int
    username: str
    content: str

class CommentCreate(CommentBase):
    pass

class CommentRead(CommentBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
