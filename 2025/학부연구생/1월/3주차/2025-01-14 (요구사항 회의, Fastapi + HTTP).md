### 9:30 회의 진행 
DB내용 먼저 진행
(연구와 관련된 개발을 먼저 우선순위를 둬서 진행)

# 필요하다 생각하는 것 적기

## Task

1. GPS 기반 분석 시스템
2. Hardware 시스템
3. 야생동물 제어 시스템 웹
4. 야생동물 제어 시스템 앱
5. 야생동물 탐지 시스템
6. 야생동물 데이터 수집 앱

- 내용을 입력할 수 있는 게시판 형식으로 만들어야 함
- 단순하게 만들어서 확장해서 개발하는 형식
- 티비 해상도에 맞춰서 어떤 공간에 무엇을 넣을 것인지 정하기
    - 최대 픽셀 확인하기

---

### 3x2로 총 6개의 대시보드를 나눌 예정

1. 연구자 목록 - 직책, 업무
    
2. 퇴치 기기 정보
    
    - 개발 할 목록 리스트, 개발 중인 목록 리스트, 전시 목록 리스트 → 세부 일정 등 사용자가 등록해서 올리는 방안으로 개발
    - Gantt chart 형식으로 띄우기 → google Calender API 받아오기 → Notion연동 가능
3. 진행 현황
    
    - 기기 정보, 에러, 진행 상황
    - 슬랙에서 Todo List 대시보드 등록 → 대시보드에도 등록되게 만들기
        - 이번주 목표 적기, 한달 목표 정해서 체크박스로 표시되게 만들기
4. DB 정보 (우선순위 : 상)
    
    - Repellent_data
    - Repellent_sound
    - Repellent_device
    - GPS
    
    **이번주 까지 목표**
    
5. DB 데이터 수집된 종 분포 띄워놓기
    
    - [야생동물 탐지 DB 현황](https://www.notion.so/DB-12cec508cf3c8066add2e330936dbfd9?pvs=21) DB에 그대로 있으니 확인해서 띄워놓기
6. 동물 제어 방식 분류 및 문서화
    

- [동물 제어 방식 분류 및 문서화](https://www.notion.so/12cec508cf3c8025891eda23dacc3ea5?pvs=21)

![[스크린샷 2024-12-13 오후 1.12.04.png]]

동물 제어 방식 문서화에 있는 이미지를 보고 거리를 클릭하면 그에 맞게 5m 이내일지, 이상인지 선택해서 그 부분이 강조되도록 하고, 적혀있는 정보들의 근거 자료들도 보이게 하는게 좋을듯

추후에는 실험결과와 연관지어도 될 듯함.

1. 주마다 수집한 데이터 이름: 이미지 장 수 수량 필요


> 단순하게 만들어서 확장하기

## 교수님 피드백
시스템 전반적인 장치bc, 기기db, 워킹?db를 이용해서 웹에 바로 뿌려주는 기능부터 시작하기
- DB를 어떤 그래프를 이용해서 표현할지 고민하기
---

# 📌 ORM(Object Relational Mapping)
# ORM(Object Relational Mapping)

##  ORM이란?
- 객체와 관계형 데이터베이스를 자동으로 매핑해주는 프레임워크
- SQL 대신 객체를 통해 데이터베이스를 조작할 수 있음

##  SQLAlchemy란?
- Python ORM 라이브러리
- SQL 쿼리 없이 객체로 데이터베이스를 조작 가능
- DB 종류와 상관없이 일관된 코드 유지

---

# FastAPI와 MySQL(DB) 연결하기

## 디렉터리 구조
`## 디렉터리 구조`

. ├── app.py ├── models.py └── database.py


```python
# `database.py`
- SQLAlchemy를 통해 데이터베이스 연결

```python
from sqlalchemy import *
from sqlalchemy.orm import sessionmaker

DB_URL = 'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}'

class engineconn:
    def __init__(self):
        self.engine = create_engine(DB_URL, pool_recycle=500)

    def sessionmaker(self):
        Session = sessionmaker(bind=self.engine)
        return Session()

    def connection(self):
        return self.engine.connect()

```
```
```
---
```python
# `models.py`

## 테이블과 매핑할 모델 정의

from sqlalchemy import Column, TEXT, INT, BIGINT
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Test(Base):
    __tablename__ = "test"

    id = Column(BIGINT, nullable=False, autoincrement=True, primary_key=True)
    name = Column(TEXT, nullable=False)
    number = Column(INT, nullable=False)
```
```
```

```python

#  `app.py`

## FastAPI를 사용하여 API 구현

from fastapi import FastAPI
from pydantic import BaseModel
from database import engineconn
from models import Test

app = FastAPI()
engine = engineconn()
session = engine.sessionmaker()

class Item(BaseModel):
    name: str
    number: int

@app.get("/")
async def first_get():
    example = session.query(Test).all()
    return example

```

>실행 ->  uvicorn app:app --reload

---
#  📌 Fastapi + HTTP 통신

## Requests 라이브러리 개요 및 환경설정

Requests 라이브러리는 HTTP 통신을 위한 다양한 메서드(get, post, patch, put, delete 등)를 제공하여 REST API 호출 및 데이터 요청/수정을 간편하게 수행할 수 있습니다.

### 가상환경 생성 및 Requests 설치

```python
python -m venv venv
source venv/scripts/activate
pip install requests
```

## FastAPI와 Requests를 활용한 HTTP 통신

FastAPI는 빠르고 현대적인 Python 웹 프레임워크로, requests와 함께 사용하면 효율적인 웹 개발이 가능합니다.

### FastAPI 설치

```bash
pip install "fastapi[all]"
```

### 1. GET 요청 예제

#### 서버 설정 (server.py)

```python
from typing import Union
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
```

#### 클라이언트 설정 (client.py)

```python
import requests

url = "http://localhost:8000"
resp = requests.get(url=url)

print(f"status_code: {resp.status_code}")
print(f"content: {resp.content}")
print(f"headers: {resp.headers}")
```

**출력 결과**:

```
status_code: 200
content: b'{"Hello":"World"}'
headers: {...}
```

#### Query String을 활용한 GET 요청

```python
url = "http://localhost:8000/items/1"
resp = requests.get(url=url, params={"q": 1})

print(f"status_code: {resp.status_code}")
print(f"content: {resp.content}")
print(f"headers: {resp.headers}")
```

**출력 결과**:

```
status_code: 200
content: b'{"item_id":1,"q":"1"}'
headers: {...}
```

### 2. POST 요청 예제

#### 서버 설정 (server.py)

```python
from pydantic import BaseModel
from fastapi import FastAPI

app = FastAPI()

class UserData(BaseModel):
    user_name: str
    password: str

@app.post("/login")
def login(user_data: UserData):
    return {"user_data": user_data}
```

#### 클라이언트 설정 (client.py)

```python
import requests

url = "http://localhost:8000/login"
data = {
    "user_name": "earthquake",
    "password": "pass123word123"
}

resp = requests.post(url=url, json=data)

print(f"status_code: {resp.status_code}")
print(f"content: {resp.content}")
print(f"headers: {resp.headers}")
```

**출력 결과**:

```
status_code: 200
content: b'{"user_data":{"user_name":"earthquake","password":"pass123word123"}}'
headers: {...}
```

## 프로젝트 적용 사례

Jobdam 프로젝트에서 requests를 활용하여 HTTP 통신을 구현한 예시는 아래와 같습니다.

### 예제 함수: 채팅방 생성 요청

```python
def create_chat_room(self, data: dict):
    resp = requests.post(
        url=cfg.base_url + "/chat_room/create",
        json=data,
        headers=auth_utils.build_jwt_header(cfg.config_path)
    )
    if resp.status_code == 201:
        create_room_resp = global_utils.bytes2dict(resp.content)
        return {"status_code": resp.status_code}
    elif resp.status_code == 400:
        detail = global_utils.bytes2dict(resp.content)['detail']
        return {"status_code": resp.status_code, "detail": detail}
    else:
        detail = global_utils.bytes2dict(resp.content)['detail']
        return {"status_code": resp.status_code, "detail": detail}
```

#### 주목할 점

1. **헤더 설정**:
    
    ```python
    def build_jwt_header(fpath):
        return {
            "Authorization": "Bearer " + get_access_token_from_json(fpath)
        }
    ```
    
2. **응답 데이터 변환**:
    
    ```python
    def bytes2dict(b):
        return json.loads(b.decode('utf-8'))
    ```
    

### 참고 자료

- [Requests 라이브러리 공식 문서](https://docs.python-requests.org)
- [FastAPI 공식 문서](https://fastapi.tiangolo.com)

## 💻 추가 Python Requests 라이브러리

```HTTP
>>> import requests
>>> r = requests.get('https://httpbin.org/basic-auth/user/pass', auth=('user', 'pass'))
>>> r.status_code
200
>>> r.headers['content-type']
'application/json; charset=utf8'
>>> r.encoding
'utf-8'
>>> r.text
'{"authenticated": true, ...'
>>> r.json()
{'authenticated': True, ...}
```

### HTTP 통신 요청 -> 응답
```PYTHON
pip install requests # 설치하기
```

---





---

## repellent-admin 코드 뜯기
>app/models/repellent_data.py

```python
from sqlalchemy import Column, Integer, String, DateTime, Time, ForeignKey, Enum

from sqlalchemy.orm import relationship

from .base import Base

  
  

class RepellentData(Base):

    __tablename__ = "repellent_data"

  

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    detection_date = Column(DateTime, nullable=False)  # 탐지 날짜

    detection_num = Column(Integer, nullable=False)  # 탐지 횟수

    detection_time = Column(String(255), nullable=False)  # 탐지 시간

    re_detection_minutes = Column(Integer, nullable=True)  # 재탐지 시간(분)

    detection_type = Column(String(255), nullable=False)  # 탐지 유형

    gateway_id = Column(Integer, ForeignKey("gateway.id"), nullable=False)

    repellent_device_id = Column(

        Integer, ForeignKey("repellent_device.id"), nullable=False

    )

    species = Column(

        Enum('wild_boar', 'jay', 'crow', 'magpie', 'pigeon', 'cormorant', 'sparrow', 'bulbul'),

        nullable=True

    )

    repellent_sound_id = Column(

        Integer, ForeignKey("repellent_sound.id"), nullable=False

    )

  

    # relationship 설정

    gateway = relationship("Gateway", back_populates="repellent_data")

    repellent_device = relationship("RepellentDevice", back_populates="repellent_data")

    repellent_sound = relationship("RepellentSound", back_populates="repellent_data")
```

# RepellentData 모델 설명

## 테이블 이름
- `__tablename__ = "repellent_data"` 
-> mysql서버로 되어있음

## 컬럼 정의
- **`id`**
  - 타입: `Integer`
  - 설명: 기본 키, 자동 증가, 인덱스 추가
  - 속성: `primary_key=True`, `index=True`, `autoincrement=True`

- **`detection_date`**
  - 타입: `DateTime`
  - 설명: 탐지 날짜
  - 속성: `nullable=False`

- **`detection_num`**
  - 타입: `Integer`
  - 설명: 탐지 횟수
  - 속성: `nullable=False`

- **`detection_time`**
  - 타입: `String(255)`
  - 설명: 탐지 시간
  - 속성: `nullable=False`

- **`re_detection_minutes`**
  - 타입: `Integer`
  - 설명: 재탐지 시간(분)
  - 속성: `nullable=True`

- **`detection_type`**
  - 타입: `String(255)`
  - 설명: 탐지 유형
  - 속성: `nullable=False`

- **`gateway_id`**
  - 타입: `Integer`
  - 설명: `gateway` 테이블의 `id`를 참조 (외래 키)
  - 속성: `ForeignKey("gateway.id")`, `nullable=False`

- **`repellent_device_id`**
  - 타입: `Integer`
  - 설명: `repellent_device` 테이블의 `id`를 참조 (외래 키)
  - 속성: `ForeignKey("repellent_device.id")`, `nullable=False`

- **`species`**
  - 타입: `Enum`
  - 설명: 탐지된 동물 종 (열거형)
  - 허용값: 
    - `wild_boar`
    - `jay`
    - `crow`
    - `magpie`
    - `pigeon`
    - `cormorant`
    - `sparrow`
    - `bulbul`
  - 속성: `nullable=True`

- **`repellent_sound_id`**
  - 타입: `Integer`
  - 설명: `repellent_sound` 테이블의 `id`를 참조 (외래 키)
  - 속성: `ForeignKey("repellent_sound.id")`, `nullable=False`

## 관계 정의 (Relationship)
- **`gateway`**
  - 설명: `Gateway` 모델과의 관계
  - 설정: `relationship("Gateway", back_populates="repellent_data")`

- **`repellent_device`**
  - 설명: `RepellentDevice` 모델과의 관계
  - 설정: `relationship("RepellentDevice", back_populates="repellent_data")`

- **`repellent_sound`**
  - 설명: `RepellentSound` 모델과의 관계
  - 설정: `relationship("RepellentSound", back_populates="repellent_data")`

---

### 💻 참고
[파이썬-하위패키지](https://cuorej.tistory.com/entry/PYTHON-%EC%97%AC%EB%9F%AC-%EA%B2%BD%EB%A1%9C%EC%9D%98-%EB%AA%A8%EB%93%88-import-%ED%95%98%EA%B8%B0-1)
[파이썬-하위패키지1](https://fastapi.tiangolo.com/tutorial/bigger-applications/#an-example-file-structure)
[파이썬-소켓통신](https://codezaram.tistory.com/31https://codezaram.tistory.com/31)
[파이썬-Requests](https://light-tree.tistory.com/6)
[Fasitapi-ApiRouter](https://fastapi.tiangolo.com/reference/apirouter/)
[파이썬-라우터](https://lsjsj92.tistory.com/651)
