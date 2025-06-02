# Hugging Face 참고
[Image-Text-to-Text](https://huggingface.co/models?pipeline_tag=image-text-to-text&sort=downloads)

# Frontend
## Main
- mainpage -> 전체적인 내용 교체
- 폴더 구조 - 폴더 이름 수정/ 폴더 생성 / 새노트 연결 개발
- 즐겨찾기 / 최근노트 기능 구현
![[main.png]]
## Floder
![[folder.png]]
## Upload
- 업로드 모든 파일 가능(드래그로도 가능하게 구현)
- jpg, pdf를 화면에서 바로 볼 수 있게 만듬(원도우에서) 수정해야함
![[upload.png]]
## OCR
- OCR 실행 -> 영어 먼저 테스트 이미지에서 텍스트를 가져와서 노트에 새로 저장함(후에 LLM 요약이랑 연결지어서 요약본으로 정리 필요)

![[OCR.png]]

---
# Backend
## Swagger 확인
![[swagger.png]]
## 엔티티 관계도 
![[엔티티 관계도.png]]
- folder 테이블 생성 및 조건 연결
- conda - 버전 연결