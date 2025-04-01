### **Notion** 
https://www.notion.so/_FastAPI-1b9ec508cf3c809fb853cc0f37f058fe?pvs=4

### 📁 **백엔드 디렉토리 구조**  

```
📂 labeling
 ├── 📂 server
 │    ├── 📂 app
 │    │    ├── 📂 models           # 데이터베이스 모델 정의
 │    │    │    ├── __init__.py    # SQLAlchemy 모델을 모아놓는 파일
 │    │    │    ├── project.py     # 프로젝트 관련 테이블 정의 (projects)
 │    │    │    ├── image.py       # 이미지 관련 테이블 정의 (images)
 │    │    │    ├── label.py       # 라벨 관련 테이블 정의 (labels)
 │    │    │    
 │    │    ├── 📂 routers          # FastAPI 엔드포인트 라우터
 │    │    │    ├── __init__.py    # 라우터 모듈 초기화
 │    │    │    ├── project.py     # 프로젝트 관련 API (생성, 조회 등)
 │    │    │    ├── image.py       # 이미지 관련 API (업로드, 삭제, 조회 등)
 │    │    │    ├── label.py       # 라벨 관련 API (추가, 삭제, 조회 등)
 │    │    │    
 │    │    ├── 📂 schemas          # Pydantic 데이터 검증 스키마
 │    │    │    ├── __init__.py    # 스키마 모듈 초기화
 │    │    │    ├── project.py     # 프로젝트 데이터 검증 스키마
 │    │    │    ├── image.py       # 이미지 데이터 검증 스키마
 │    │    │    ├── label.py       # 라벨 데이터 검증 스키마
 │    │    │    
 │    │    ├── 📂 database         # 데이터베이스 설정
 │    │    │    ├── __init__.py    # 데이터베이스 초기화
 │    │    │    ├── connection.py  # DB 연결 설정
 │    │    │    
 │    │    ├── 📂 config           # 설정 파일
 │    │    │    ├── __init__.py    # 설정 모듈 초기화
 │    │    │    ├── config.py      # 환경변수 및 설정 정보
 │    │    │    
 │    │    ├── main.py             # FastAPI 앱 실행 파일
 │    │    
 │    ├── requirements.txt         # 프로젝트에서 사용하는 패키지 목록
 │    ├── Dockerfile               # 도커 컨테이너 설정 파일
 │    ├── .env                     # 환경 변수 파일 (DB 접속 정보 등)
 │
 ├── 📂 migrations                 # Alembic 마이그레이션 파일 (DB 스키마 변경)
 │    ├── versions                  # 버전별 마이그레이션 기록
 │    ├── env.py                    # Alembic 환경 설정
 │    ├── script.py.mako            # 마이그레이션 템플릿
 │
 ├── README.md                      # 프로젝트 설명 및 사용법 문서
```

---

### **1️⃣ `models/` (데이터베이스 모델)**
- `project.py`: `projects` 테이블 정의 (프로젝트 ID, 이름 등)
- `image.py`: `images` 테이블 정의 (이미지 ID, 프로젝트 ID, 경로, 즐겨찾기 여부)
- `label.py`: `labels` 테이블 정의 (라벨 ID, 이미지 ID, 라벨 데이터)

### **2️⃣ `routers/` (API 라우터)**
- `project.py`: 프로젝트 CRUD API (추가, 조회)
- `image.py`: 이미지 업로드, 삭제, 조회 API
- `label.py`: 라벨 추가, 삭제, 조회 API

### **3️⃣ `schemas/` (Pydantic 데이터 검증)**
- `project.py`: 프로젝트 데이터 유효성 검사
- `image.py`: 이미지 데이터 유효성 검사
- `label.py`: 라벨 데이터 유효성 검사

### **4️⃣ `database/` (데이터베이스 연결)**
- `connection.py`: MySQL과 SQLAlchemy 연결 설정

### **5️⃣ `config/` (환경 설정)**
- `config.py`: CORS 설정, Swagger UI 설정, 데이터베이스 설정

### **6️⃣ `main.py`**
- FastAPI 앱 실행 및 미들웨어 설정
- `app.include_router()`로 라우터 연결

---

 

