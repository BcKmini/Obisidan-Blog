from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Label(Base):
    __tablename__ = "labels"

    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("images.id", ondelete="CASCADE"))
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    label_data = Column(String(255), nullable=False)  # ✅ YOLO txt 파일 경로 저장

    # ✅ 관계 정의 (이미지와 연결)
    image = relationship("Image", back_populates="labels")
