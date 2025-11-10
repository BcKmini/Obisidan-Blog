- [깃헛참고](https://github.com/microsoft/GenerativeImage2Text)
- [지피티참고](https://chatgpt.com/s/dr_6815eb1941fc8191bc562f6e6c2f3902)

---

# 문서 스캔용 무료 OCR 및 멀티모달 모델 현황 (2025년 기준)

## 목차
- [오픈소스 OCR 및 멀티모달 모델 (로컬 설치형)](#오픈소스-ocr-및-멀티모달-모델-로컬-설치형)
- [무료 OCR API (클라우드 서비스)](#무료-ocr-api-클라우드-서비스)

## 오픈소스 OCR 및 멀티모달 모델 (로컬 설치형)
- **Tesseract OCR**
  - 모델 유형: LSTM 기반 OCR 엔진  
  - 제공 방식: 오픈소스 (Apache 2.0)  
  - 배포: 로컬 설치 (C++ 라이브러리/CLI)  
  - 상업적 이용: 허용  
  - 지원 형식: 100여 개 언어, PNG/JPEG/TIFF → TXT/HOCR/PDF  
  - 링크: [GitHub](https://github.com/tesseract-ocr/tesseract)  

- **EasyOCR**
  - 모델 유형: 딥러닝 OCR (PyTorch)  
  - 제공 방식: 오픈소스 (Apache 2.0)  
  - 배포: 로컬 (Python 라이브러리)  
  - 상업적 이용: 허용  
  - 지원 형식: 80+개 언어, 자연 이미지·문서 OCR  
  - 링크: [GitHub](https://github.com/JaidedAI/EasyOCR)  

- **PaddleOCR**
  - 모델 유형: OCR 딥러닝 모델 모음  
  - 제공 방식: 오픈소스 (Apache 2.0)  
  - 배포: 로컬 (Python/PaddlePaddle)  
  - 상업적 이용: 허용  
  - 지원 형식: 다국어 OCR, 레이아웃·표 인식  
  - 링크: [PaddleOCR 문서](https://paddlepaddle.github.io/PaddleOCR)  

- **docTR (Mindee)**
  - 모델 유형: 딥러닝 기반 OCR 라이브러리  
  - 제공 방식: 오픈소스 (Apache 2.0)  
  - 배포: 로컬 (Python 라이브러리)  
  - 상업적 이용: 허용  
  - 지원 형식: 텍스트 검출+인식 파이프라인, 커스텀 훈련  
  - 링크: [GitHub](https://github.com/mindee/doctr)  

- **TrOCR (Microsoft)**
  - 모델 유형: Transformer 기반 OCR  
  - 제공 방식: 오픈소스 (MIT)  
  - 배포: 로컬 (Python/Transformers)  
  - 상업적 이용: 허용  
  - 지원 형식: 인쇄·필기체 인식 SOTA  
  - 링크: [Hugging Face](https://huggingface.co/models/microsoft/trocr)  

- **Donut (NAVER CLOVA)**
  - 모델 유형: 멀티모달 문서 이해 모델  
  - 제공 방식: 오픈소스 (MIT)  
  - 배포: 로컬 (Python/PyTorch)  
  - 상업적 이용: 허용  
  - 지원 형식: OCR-Free 문서 파싱, 영수증·양식 추출  
  - 링크: [GitHub](https://github.com/clovaai/donut)  

- **Kraken OCR**
  - 모델 유형: 딥러닝 기반 OCR 엔진  
  - 제공 방식: 오픈소스 (Apache 2.0)  
  - 배포: 로컬 (Python)  
  - 상업적 이용: 허용  
  - 지원 형식: 역사 문서·비라틴 문자 특화, 레이아웃 분석  
  - 링크: [Kraken](https://kraken.re/)  

- **기타 오픈소스**
  - OCRopus, CuneiForm, GOCR 등  
  - 특징: 초기 프로젝트, 정확도·유지보수 부족  
  - 권장: 최신 모델 우선 사용  

## 무료 OCR API (클라우드 서비스)
- **Google Cloud Vision OCR**
  - 유형: 클라우드 OCR API  
  - 무료 사용량: 월 1,000건  
  - 배포: REST API  
  - 상업적 이용: 허용  
  - 지원 형식: 이미지/PDF, 다국어 인쇄체·필기체  
  - 링크: [공식문서](https://cloud.google.com/vision/docs/ocr)  

- **Azure Computer Vision OCR**
  - 유형: 클라우드 OCR API  
  - 무료 사용량: 월 5,000건  
  - 배포: REST API  
  - 상업적 이용: 허용  
  - 지원 형식: 레이아웃 분석, 필기체  
  - 링크: [문서](https://learn.microsoft.com/azure/cognitive-services/computer-vision/)  

- **AWS Textract**
  - 유형: 문서 OCR + 데이터 추출  
  - 무료 사용량: 신규 가입자 3개월 간 월 1,000페이지  
  - 배포: SDK/REST  
  - 상업적 이용: 허용  
  - 지원 형식: 폼·테이블 구조화  
  - 링크: [AWS Textract](https://aws.amazon.com/textract/)  

- **AWS Rekognition Text**
  - 유형: 이미지·영상 텍스트 감지  
  - 무료 사용량: 월 5,000건 (1년)  
  - 배포: SDK/REST  
  - 상업적 이용: 허용  
  - 지원 형식: 실시간 장면 텍스트  
  - 링크: [Rekognition](https://aws.amazon.com/rekognition/)  

- **OCR.space API**
  - 유형: 온라인 OCR API  
  - 무료 사용량: 월 25,000건  
  - 배포: REST API  
  - 상업적 이용: 허용  
  - 지원 형식: 이미지/PDF → 텍스트  
  - 링크: [OCR.space](https://ocr.space/)  

- **Kakao Vision OCR**
  - 유형: 카카오 비전 OCR API  
  - 무료 사용량: 월 300만 건  
  - 배포: REST API  
  - 상업적 이용: 허용  
  - 지원 형식: 한글 포함 다국어, 영역 탐지+인식  
  - 링크: [Kakao Developers](https://developers.kakao.com/)  

- **NAVER Clova OCR**
  - 유형: 클라우드 OCR API  
  - 무료 사용량: 월 300건  
  - 배포: REST API  
  - 상업적 이용: 허용  
  - 지원 형식: 문서/명함/영수증, 필드 추출  
  - 링크: [Naver Cloud](https://www.ncloud.com/)  

- **Cloudmersive OCR**
  - 유형: 클라우드 OCR API  
  - 무료 사용량: 월 50,000건  
  - 배포: REST API  
  - 상업적 이용: 허용  
  - 지원 형식: 90+개 언어, 기울임 보정  
  - 링크: [Cloudmersive](https://cloudmersive.com/)  

- **Google ML Kit (On-Device)**
  - 유형: 모바일 OCR SDK  
  - 무료 사용량: 제한 없음  
  - 배포: 로컬 (모바일)  
  - 상업적 이용: 허용  
  - 지원 형식: 한국어 등 다중 문자, 오프라인 인식  
  - 링크: [ML Kit Text Recognition](https://developers.google.com/ml-kit/vision/text-recognition/v2)  
