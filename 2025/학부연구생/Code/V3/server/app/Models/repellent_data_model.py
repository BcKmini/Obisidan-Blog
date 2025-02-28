from sqlalchemy import Column, Integer, String, BigInteger
from app.database import Base

class RepellentData(Base):
    __tablename__ = "repellent_data"

    id = Column(BigInteger, primary_key=True, index=True)  # 고유 ID
    detection_time = Column(Integer)  # 감지 시간 (datetime 형식)
    gateway_id = Column(BigInteger)  # 게이트웨이 ID (NULL 허용)
    repellent_device_id = Column(BigInteger)  # 장치 ID
    repellent_sound_id = Column(BigInteger)  # 소리 ID
    species = Column(String)  # 감지된 종 (species)
    detection_date = Column(Integer)  # 감지 날짜
    detection_num = Column(Integer)  # 감지된 개체 수
