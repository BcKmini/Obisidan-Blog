프롬프트 및 답변 전체 정리 문서

========================================
1. 요청 배경
========================================
사용자는 체육관에서 열리는 운동회를 위해
어린이석, 부모님석(돗자리), 본부석, 출입문 등이 포함된
자리 배치도를 만들어야 했습니다.

이를 위해:
- 텍스트는 모두 한국어로 표시
- 운동회 진행 구역 포함
- 반별 어린이석 3개(씨앗반·새싹반·꽃잎반)
- 부모님석 + 돗자리 구역 3개
- 본부석(설명 문구 포함)
- 출입문 명확히 표기
- 전체 구성은 표처럼 정돈된 2D 다이어그램 형태
- 색상은 은은한 베이지 배경
- 테두리는 둥근 사각형

이런 조건으로 **이미지 생성용 프롬프트**를 만들어달라고 요청했습니다.


========================================
2. 사용자 요구 조건 정리
========================================
(비전공자도 이해할 수 있도록 표현함)

3) 체육관에서 운동회를 진행할 수 있는 넓은 공간을 표시해야 함.

4) 어린이들이 반별로 앉을 자리 필요  
   → 씨앗반, 새싹반, 꽃잎반  
   → 3×3 정사각형 좌석(□) 형태

5) 부모님들이 돗자리를 깔고 앉을 공간 필요  
   → 각 반별로 부모님석 + 돗자리 구역이 한 세트로 구성

6) 본부석 필요  
   → 치료, 음료·물품 전달, 안내·총괄을 담당하는 자리  
   → 너무 크지 않아야 함

7) 출입문을 본부석 아래쪽에 명확하게 표시해야 함  
   → 텍스트 "출입문"

8) 전체 배치도는 종이 안내문처럼 단정한 느낌이어야 함  
   → 표와 상자(네모) 형태로 정렬  
   → 배경은 밝은 베이지색  
   → 전체는 둥근 테두리 박스로 감싸기

9) 한국어 문구는 절대 바뀌면 안 됨  
   → 예: “씨앗반 어린이석”, “돗자리 구역”, “본부석” 등  
   → 그대로 들어가야 함

10) DALL·E에 입력할 **정확하고 깨끗한 프롬프트**가 필요함  
   → 영어 금지  
   → 한국어 그대로 표시 지시  
   → 원하는 구조를 정확히 묘사할 수 있도록 상세 설명 필수


========================================
3. 최종 완성된 이미지 생성용 프롬프트
========================================
(모든 한국어 문구 정확히 반영하여 최종 정리)

--------------------------------------------------
[최종 프롬프트]
--------------------------------------------------

Create a clean, flat 2D layout diagram in Korean, styled like a printed seating chart.
Do NOT add any English.
Do NOT change any Korean wording.
Use rectangles, table alignment, and a light beige background.
Border the entire image with a thin rounded rectangle.


[1] Title at the very top (center, bold, large):
"체육관"


[2] Large rounded rectangle centered below title.
Inside it, place the following two lines exactly:

"운동회 진행 공간"
"(어른·아이 모두 참여 가능한 넓은 정기 구역)"


[3] Three evenly spaced blocks for children seating.
Each block contains a title and a 3×3 grid of □ squares.

Left block title:
"씨앗반 어린이석"

Center block title:
"새싹반 어린이석"

Right block title:
"꽃잎반 어린이석"


[4] Three parents' seating blocks.
Each block contains a title, and below it one green rounded rectangle that contains the text "돗자리 구역".

Left block title:
"씨앗반 부모님석"
Green rectangle label inside: "돗자리 구역"

Center block title:
"새싹반 부모님석"
Green rectangle label inside: "돗자리 구역"

Right block title:
"꽃잎반 부모님석"
Green rectangle label inside: "돗자리 구역"


[5] At the bottom center, place a compact white rounded rectangle labeled:
"본부석"

Below that label (inside the same rectangle), include the line exactly:
"응급·치료 / 음료·물품 배부 / 안내·총괄 진행"


[6] Under 본부석, centered clearly, place a small white box with the text:
"출입문"


Layout order from top to bottom:
체육관 → 운동회 진행 공간 → 어린이석 3개 → 부모님석+돗자리 3개 → 본부석 → 출입문

--------------------------------------------------


========================================
4. 이미지 생성 결과
========================================
프롬프트를 적용해 생성한 이미지에는 다음 요소가 정확히 나타났습니다:

- 상단 중앙에 큰 글씨 “체육관”
- 가운데 대형 박스: “운동회 진행 공간” + 추가 문구
- 3개 반 어린이 좌석(각각 3×3 박스)
- 씨앗반 / 새싹반 / 꽃잎반 부모님석 + “돗자리 구역”
- 본부석 + 상세 기능 설명
- 본부석 아래 “출입문” 박스
- 전체를 감싸는 둥근 테두리
- 은은한 베이지 배경


========================================
5. 비전공자도 한눈에 이해할 수 있는 핵심 설명
========================================

이 문서는 **체육관에서 운동회 자리 배치도를 만들기 위해
AI에게 원하는 이미지를 정확하게 생성하도록 하는 방법**을 정리한 것입니다.

✔ 반별 어린이들이 앉을 구역은 좌석 박스 형태  
✔ 부모님은 반별로 돗자리를 깔 수 있는 공간이 따로 있음  
✔ 본부석에서는 응급, 음료, 물품 배부 등 진행 업무 담당  
✔ 출입문은 가장 아래에 명확히 표시  
✔ 전체 구조는 가독성 좋게 정돈된 표 형태  
✔ 모든 글자는 한국어 그대로 유지해야 함  

이 조건을 기반으로  
AI 이미지 생성 도구(DALL·E)가  
**정확한 자리 배치도 이미지**를 만들 수 있게  
프롬프트를 완성한 것입니다.

