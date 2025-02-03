from sqlalchemy import Column, Integer, String, BigInteger
from app.database import Base

class RepellentSound(Base):
    __tablename__ = "repellent_sound"

    id = Column(BigInteger, primary_key=True, index=True)  # 고유 ID
    sound_name = Column(String)  # 소리 이름
    sound_level = Column(Integer)  # 소리 레벨
