from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import data_router, device_router, sound_router
from dotenv import load_dotenv
import os

# .env 파일 로드
load_dotenv()

# 환경 변수 읽기
HOST = os.getenv("HOST")
PORT = int(os.getenv("PORT"))
ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS")

origins = [origin.strip() for origin in ALLOW_ORIGINS.split(",")]

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 환경변수에서 읽어온 origins 리스트 사용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 추가
app.include_router(data_router)
app.include_router(device_router)
app.include_router(sound_router)

# 루트 경로 정의
@app.get("/")
def read_root():
    return {"message": "성 공 ! "}

# FastAPI 실행
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)