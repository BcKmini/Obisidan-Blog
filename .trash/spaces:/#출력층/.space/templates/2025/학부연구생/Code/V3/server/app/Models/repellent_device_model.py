from sqlalchemy import Column, Integer, String, BigInteger
from app.database import Base

class RepellentDevice(Base):
    __tablename__ = "repellent_device"

    id = Column(BigInteger, primary_key=True, index=True)  # 고유 ID
    name = Column(String)  # 장치 이름
    latitude = Column(BigInteger)  # 위도
    longitude = Column(BigInteger)  # 경도
    is_activated = Column(Integer)  # 활성화 여부
    is_working = Column(Integer)  # 작동 상태
