import logging
from sqlalchemy import create_engine, MetaData, Column, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.engine import Engine

# SQLAlchemy 쿼리 로깅 최소화
logging.basicConfig()
logging.getLogger("sqlalchemy.engine").setLevel(logging.ERROR)  # 🚀 ERROR 이상만 출력

# 필요 없는 이벤트 리스너 제거
# @event.listens_for(Engine, "before_cursor_execute")
# def log_query(conn, cursor, statement, parameters, context, executemany):
#     logging.info("Running query: %s, Parameters: %s", statement, parameters)

# 데이터베이스 엔진 생성 (echo=False)
engine = create_engine("sqlite:///database.db", echo=False)  # 쿼리 로깅 제거

# 공통 필드 포함된 Base 클래스 생성
metadata = MetaData()

class Base:
    created_at = Column(DateTime, default=func.now())  # 생성 시간
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())  # 수정 시간 자동 업데이트
    __name__: str

Base = declarative_base(metadata=metadata, cls=Base)