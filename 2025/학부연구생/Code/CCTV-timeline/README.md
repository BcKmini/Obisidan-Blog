프로젝트 개요

    Flask(백엔드)와 HTML/CSS/JavaScript(프론트엔드)를 사용해 동영상을 업로드하고 프레임을 추출하여 웹상에서 확인
    OpenCV를 통해 1초 간격으로 프레임을 추출하고, 업로드된 영상을 재생 가능
    업로드된 영상과 추출된 프레임은 static/uploads, static/frames 폴더에 저장

주요 기술 스택

    프론트엔드: HTML, CSS, JavaScript
    백엔드: Python Flask
    프레임 추출: OpenCV
    파일 업로드: Flask, werkzeug

설치 및 실행 방법

```
pip install -r  requirements.txt
```

서버 실행
```
python app.py
```

브라우저에서 확인

    http://127.0.0.1:5000 접속
    동영상 파일 업로드 후, 타임라인 이미지와 영상 재생 확인


기능 설명

    파일 업로드: static/uploads 폴더에 저장
    프레임 추출: OpenCV로 1초마다 프레임 저장 (static/frames 폴더)
    프론트: 업로드 폼, 타임라인, 영상 재생 UI 구성
    백엔드: 업로드 라우트(/upload), 프레임 추출 라우트(/extract_frames) 제공

폴더 구조
.
├── app.py
├── static
│   ├── css
│   │   └── style.css
│   ├── frames
│   ├── js
│   │   └── app.js
│   └── uploads
├── templates
│   └── index.html
└── venv (가상환경 폴더, 선택사항)
