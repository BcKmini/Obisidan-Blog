from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from sqlalchemy.sql import func

Base = declarative_base()

class Observation(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True, index=True)
    species_category = Column(String(50), nullable=False)
    species_name = Column(String(100), nullable=False)
    habitat_type = Column(String(100), nullable=True)
    observation_date = Column(DateTime, nullable=True)
    location = Column(String(100), nullable=True)
    memo = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    video_url = Column(Text, nullable=True)
    audio_url = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    latitude = Column(Float, nullable=True)   # 여기서 nullable=True
    longitude = Column(Float, nullable=True)  # 여기서 nullable=True
