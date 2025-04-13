## 📦 데이터 수집 웹 서비스 - V1 백엔드

### TOC
- 프로젝트 개요
- 서비스 구조
- 백엔드 구조
- 주요 기능
- 데이터베이스 모델
- 기능별 설명
- 참고 이미지

---
## 프로젝트 개요
- 자연 생물 관찰 데이터를 기록하고 공유하는 웹 기반 플랫폼
- 사진, 동영상, 음성 등 다양한 미디어 업로드 지원
- 관찰 위치는 카카오 지도 API를 사용해 정확히 지정
- 관찰 시간/날짜 + 날씨 API를 통해 상세 정보 자동 수집

---
## 서비스 구조
```plaintext
[React Frontend] <--> [FastAPI Backend] <--> [PostgreSQL / MySQL]
                             |
                             └── uploads/
                                   ├── img/
                                   ├── mp4/
                                   └── audio/

```

---
## 백엔드 구조
```bash
server/
├── models/              # SQLAlchemy ORM 모델
│   ├── observation.py   # 관찰 정보 테이블
│   └── comment.py       # 댓글 테이블
│
├── schemas/             # Pydantic 스키마 (API 데이터 구조)
│   ├── observation_schema.py
│   └── comment_schema.py
│
├── routers/             # FastAPI 라우터 모듈
│   ├── observation_router.py
│   └── comment_router.py
│
├── uploads/             # 사용자 업로드 파일 저장
│   ├── img/
│   ├── mp4/
│   └── audio/
│
├── db.py                # DB 연결 및 세션 관리
├── main.py              # FastAPI 앱 실행 진입점
└── requirements.txt     # 의존 패키지 리스트

```

---
## 주요 기능

- 관찰 데이터 등록 (사진, 동영상, 오디오 포함)
- 관찰 위치 좌표 저장 (위/경도)
- 관찰일 기준 날씨 정보 자동 호출
- React 프론트에서 API 요청으로 데이터 바인딩
- 상세 페이지에서 관찰정보 + 위치 + 날씨 정보 표시
- 댓글 작성 및 연결된 관찰 ID 기반 DB 저장
---
## 데이터베이스 모델

### 📄 observations

|컬럼명|타입|설명|
|---|---|---|
|id|int|기본 키|
|species_category|str|생물종 분류 (예: 조류, 식물)|
|species_name|str|이름|
|habitat_type|str|서식지 유형|
|observation_date|datetime|관찰 일시|
|location|str|관찰 위치 (주소)|
|latitude|float|위도|
|longitude|float|경도|
|image_url|str|이미지 파일 경로|
|video_url|str|비디오 파일 경로|
|audio_url|str|오디오 파일 경로|
|memo|str|관찰 메모|
|created_at|datetime|등록일|

---
### 💬 comments

| 컬럼명            | 타입       | 설명                  |
| -------------- | -------- | ------------------- |
| id             | int      | 기본 키                |
| observation_id | int      | 관찰 ID (foreign key) |
| username       | str      | 작성자 이름              |
| content        | str      | 댓글 내용               |
| created_at     | datetime | 작성 시간               |

---
## 기능별 설명

### ✅ 업로드 기능

- 이미지/비디오/오디오는 `Drag & Drop` 또는 `파일 선택`
- FastAPI `File` 업로드 핸들러로 수신 후 `uploads/`에 저장
    
### ✅ 관찰 위치 저장
- Kakao 지도 API 사용
- 좌표 선택 → 주소 + 위/경도 저장
    
### ✅ 날씨 API
- 기상청 또는 외부 날씨 API 활용
- 관찰 날짜, 위경도 기준 날씨 자동 수집
    
### ✅ 메인 페이지 구성
- React에서 썸네일 형태로 목록 카드 표시
- 이미지 여러 개일 경우 아이콘으로 표시
- 이름, 지역, 날짜 등 기본 정보 표시
    
### ✅ 상세 페이지
- 큰 이미지 및 위치 지도 및 업로드시 사용된 정보 
- 상세페이지에 맞는 위키피디아 정보 제공 
- 날씨 정보 (기온, 풍속, 강수량 등)
- 댓글 입력 및 출력

---
## 참고이미지
#### 메인페이지
![[스크린샷 2025-04-13 21.47.11.png]]
#### 업로드페이지
![[스크린샷 2025-04-13 21.47.29.png]]
#### 상세페이지
![[스크린샷 2025-04-13 21.47.50.png]]
## DB
![[스크린샷 2025-04-13 21.49.32.png]]
#### 업로드 지도
![[스크린샷 2025-04-13 21.51.08.png]]