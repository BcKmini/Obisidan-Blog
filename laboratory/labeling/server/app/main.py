from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers import image, project, label  # ✅ label 라우터 추가
from .database import engine, Base
import os

# FastAPI 앱 초기화
app = FastAPI()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프론트엔드 URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# ✅ 라우터 등록
app.include_router(image.router, prefix="/api/v1/images", tags=["Images"])
app.include_router(project.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(label.router, prefix="/api/v1/labels", tags=["Labels"])  # ✅ 라벨 기능 추가

# 기본 라우트
@app.get("/")
def root():
    return {"message": "Labeling Tool API is running!"}
