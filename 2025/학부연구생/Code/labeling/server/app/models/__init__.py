from sqlalchemy.exc import SQLAlchemyError
from .base import Base
from ..database import engine
import logging
from .image import Image
from .label import Label 
from .project import Project

# INFO, ERROR, WARNING, CRITICAL, DEBUG 중 택 1
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

__all__ = [
    "Image",
    "Project"
]

try:
    logger.info("테이블 생성 시작")
    Base.metadata.create_all(bind=engine)
    logger.info("테이블 생성 완료")
except SQLAlchemyError as e:
    print(f"에러가 발생한 테이블: {e}")
