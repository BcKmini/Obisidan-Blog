# Pyhton - Streamlit
![[Streamlit.png]]
## 📌 Streamlit이란?

**Streamlit**은 데이터를 기반으로 한 웹 애플리케이션을 쉽고 빠르게 제작할 수 있는 **오픈소스 Python 프레임워크** , HTML, CSS, JavaScript 같은 웹 개발 지식이 없어도 **Python 코드만으로 시각적이고 직관적인 웹앱**을 만들 수 있다.

---

### ❐ Streamlit의 장점

1. **간편성**  
    웹 개발 지식 없이도 짧은 코드로 애플리케이션 제작 가능.
    
2. **반응형 UI 제공**  
    실시간 업데이트 위젯으로 데이터와 시각화 상호작용 용이.
    
3. **데이터 통합**  
    Pandas, Matplotlib, Plotly 등 주요 라이브러리와의 손쉬운 통합.
    
4. **빠른 프로토타이핑**  
    앱의 구조와 디자인을 빠르게 변경 가능, 실험적 프로토타입 제작에 이상적.
    
5. **시각적 전달력**  
    데이터 기반 인사이트를 효과적으로 전달하기 위한 시각화 도구 제공.
    


### ❐ Streamlit의 한계점

1. 기본 무료 계정으로는 **최대 3개의 애플리케이션** 배포 가능.
2. **Public GitHub Repository**에서만 배포 가능.
3. **RAM 제한** (1GB)으로 대규모 데이터 분석에는 부적합.

**활용 팁**  
Streamlit은 단순하고 가벼운 웹 애플리케이션 제작에 적합하며, 대규모 애플리케이션에는 다른 프레임워크를 고려해야함

---

### ❐ 설치 및 기본 실행

1. **가상환경 생성**
```python
python -m venv streamlit_env
```

- 2. 가상환경 활성화
```python
# Windows
streamlit_env\Scripts\activate.bat

# Mac/Linux
source streamlit_env/bin/activate
```

- 3. Stramlit 설치 및 확인
```python
pip install streamlit

streamlit hello

```

---
## 📌 주요 기능 코드
```python
-- # 텍스트 입력 방법
import streamlit as st

# 텍스트 엘리먼트
st.title("Streamlit 텍스트 예제")
st.header("헤더 텍스트")
st.subheader("서브헤더 텍스트")
st.text("일반 텍스트를 입력합니다.")
st.markdown("**마크다운 형식**으로 텍스트를 입력할 수 있습니다.")

-- # 데이터 시각화
import streamlit as st
import pandas as pd

# DataFrame 생성
data = {'이름': ['Alice', 'Bob', 'Charlie'], '점수': [85, 90, 78]}
df = pd.DataFrame(data)

# DataFrame 출력
st.dataframe(df)  # 인터랙티브한 UI 제공
st.table(df)  # 정적 테이블 제공

# 그래프 시각화
import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# 데이터 생성
data = pd.DataFrame({'x': range(10), 'y': [x**2 for x in range(10)]})

# Matplotlib 그래프
st.line_chart(data)  # 기본 제공 라인 차트
st.bar_chart(data)  # 기본 제공 바 차트

# Matplotlib 활용
fig, ax = plt.subplots()
ax.plot(data['x'], data['y'], label="y = x^2")
ax.set_title("Matplotlib 그래프")
st.pyplot(fig)


-- ## 인풋 위젯 활용 
import streamlit as st
import pandas as pd

# 텍스트 입력
user_input = st.text_input("이름을 입력하세요:", placeholder="홍길동")
st.write(f"입력된 이름: {user_input}")

# 다운로드 버튼
df = pd.DataFrame({'이름': ['Alice', 'Bob'], '점수': [90, 80]})
csv = df.to_csv(index=False).encode('utf-8')
st.download_button(label="CSV 다운로드", data=csv, file_name="sample.csv", mime="text/csv")

# 체크박스
if st.checkbox("체크박스 활성화"):
    st.write("체크박스가 활성화되었습니다.")



```


---
## 참고
[Streamlit](https://streamlit.io/)
[Streamlit Gallery](https://streamlit.io/gallery)
[Streamlit 예제-Github](https://github.com/zakariachowdhury/streamlit-map-dashboard)

---
# 포트포워딩 - Docker 공부
