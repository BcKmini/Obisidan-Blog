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
    detection_date = Column(Integer)
    detection_num = Column(Integer)
    
class RepellentDevice(Base):
    __tablename__ = "repellent_device"
    id = Column(BigInteger, primary_key=True, index=True)  # 고유 ID
    name = Column(String)  # 장치 이름
    latitude = Column(BigInteger)  # 위도
    longitude = Column(BigInteger)  # 경도
    is_activated = Column(Integer)  # 활성화 여부
    is_working = Column(Integer)  # 작동 상태

class RepellentSound(Base):
    __tablename__ = "repellent_sound"
    id = Column(BigInteger, primary_key=True, index=True)  # 고유 ID
    sound_name = Column(String)  # 소리 이름
    sound_level = Column(Integer)  # 소리 레벨
