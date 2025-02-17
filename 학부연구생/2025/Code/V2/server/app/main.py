from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import api

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱 생성
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:7070","http://localhost:7070"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 루트 경로 정의
@app.get("/")
def read_root():
    return {"message": "연결 기모링"}

# 라우터 등록
app.include_router(api.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=7090, reload=True)