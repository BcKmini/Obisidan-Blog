from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, default=datetime.utcnow)

    # ✅ 관계 정의 (프로젝트에 속한 이미지)
    images = relationship("Image", back_populates="project", cascade="all, delete-orphan")
