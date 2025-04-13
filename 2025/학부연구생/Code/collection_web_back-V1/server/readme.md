server/  
├── models/               # SQLAlchemy ORM 모델 (DB 테이블 구조)     
│   ├── observation.py    # 관찰 정보 모델     
│   └── comment.py        # 댓글 모델   
│    
├── schemas/              # Pydantic 스키마 (입출력 데이터 구조)     
│   ├── observation_schema.py    
│   └── comment_schema.py   
│
├── routers/              # FastAPI 라우터 (API 핸들러)    
│   ├── observation_router.py   
│   └── comment_router.py   
│   
├── uploads/              # 이미지/비디오/오디오 업로드 폴더   
│   ├── img/              # 이미지 저장 경로   
│   ├── mp4/              # 동영상 저장 경로   
│   └── audio/            # 오디오 저장 경로  
│  
├── db.py                 # DB 연결 및 세션 설정  
├── main.py               # FastAPI 앱 진입점  
├── Makefile              # 실행 자동화 (옵션)  
└── requirements.txt      # Python 패키지 목록  

