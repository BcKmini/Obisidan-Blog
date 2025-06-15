# main.py 예시
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db import engine
from models.observation import Base  # Observation 모델에 사용된 Base
from routers.observation_router import router as observation_router
from routers.comment_router import router as comment_router  # 댓글 라우터 추가

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# uploads 폴더 내 정적 파일 제공 (예: 이미지, 동영상, 오디오)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"ㅜㅡㅜ"}

# DB에 테이블 생성 (모델 기반)
Base.metadata.create_all(bind=engine)

# 라우터 등록
app.include_router(observation_router)
app.include_router(comment_router)
