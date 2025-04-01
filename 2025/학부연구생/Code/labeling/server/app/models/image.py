from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ..database import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    url = Column(String(255), nullable=False)
    is_favorite = Column(Boolean, default=False)  # ✅ 즐겨찾기 여부 추가

    # ✅ 관계 정의 (프로젝트와 연결)
    project = relationship("Project", back_populates="images")
    labels = relationship("Label", back_populates="image", cascade="all, delete-orphan")


