from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import pymysql

# MySQL 드라이버 설정
pymysql.install_as_MySQLdb()

# 데이터베이스 연결 설정
DATABASE_URL = "mysql+pymysql://kku:kkukku415@localhost/labeling"
engine = create_engine(DATABASE_URL, echo=False)  # SQL 실행 로그 출력

# 세션 설정
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 모델 정의
Base = declarative_base()

# 데이터베이스 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
