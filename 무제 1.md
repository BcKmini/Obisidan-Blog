# 디렉터리 구조
```
Backend/
├─ app/
│  ├─ __init__.py
│  ├─ main.py              # FastAPI 앱 시작점
│  ├─ api/
│  │  └─ routes.py         # /api/chat 엔드포인트
│  └─ rag/
│     ├─ __init__.py
│     ├─ chatbot.py        # ask() 메인 로직
│     ├─ retriever.py      # FAISS+BM25 병합 리트리버
│     ├─ reranker.py       # CrossEncoder 재랭크
│     ├─ verifier.py       # fact_check()
│     ├─ embeddings.py     # HuggingFace 임베더
│     ├─ prompt.py         # LLM 프롬프트 템플릿
│     └─ config.py         # (옵션) 설정 변수
├─ data/
│  ├─ raw/                 # HTML/CSV/JSON/XML 원본
│  └─ index.faiss/         # FAISS 인덱스
├─ scripts/
│  └─ ingest.py            # data → 벡터 인덱스 생성 스크립트
├─ requirements.txt
├─ .env
└─ Makefile                # `make run`, `make ingest` 등
```

---

# 시작하기
1. 사전 준비

프로젝트를 로컬 환경에 복제(clone)합니다.
```
git clone <https://github.com/KT-TeamProject-11/Backend>
cd Backend
```
2. 가상환경 생성 & 활성화
```
python -m venv venv
source venv/bin/activate
```
3. 패키지 설치
```
pip install -r requirements.txt
```
4. 데이터 인제스트 (먼저수행 임의 데이터 만들어서 테스트 해봄 -> html 참고)
```
python scripts/ingest.py
```
5. 개발 서버 실행
```
make run
# 또는
uvicorn app.main:app --reload --env-file .env
```

---

## API 문서 (Swagger UI)
서버가 실행 중인 상태에서 브라우저를 열고 아래 주소로 이동하면 FastAPI가 자동으로 생성해주는 API 문서를 확인할 수 있습니다. 이 페이지에서 직접 API를 호출하고 응답을 테스트해 볼 수 있습니다.
URL: http://localhost:8555/docs

## API- POST /api/chat
챗봇에게 질문을 보내고 답변을 받는 메인 엔드포인트입니다.
```
{ "message": "질문 내용" }
```
- Response
```
{ "answer": "챗봇 응답" }
```

## 프론트엔드 실행 및 테스트
별도로 제공되는 Frontend 레포지토리를 클론하여 실행하면, 웹 UI를 통해 백엔드 API(http://localhost:8666으로 요청)에 질문을 보내고 답변을 확인하는 전체적인 테스트를 진행할 수 있습니다. -> 참고(https://github.com/KT-TeamProject-11/Frontend)



---
### 참고
env 파일은 따로 카톡으로 공유하겠습니다.
