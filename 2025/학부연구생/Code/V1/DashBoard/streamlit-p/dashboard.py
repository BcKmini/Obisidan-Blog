import streamlit as st
import pandas as pd
from sqlalchemy import create_engine
import plotly.express as px
from st_aggrid import AgGrid
from st_aggrid.grid_options_builder import GridOptionsBuilder
from streamlit_autorefresh import st_autorefresh

# 페이지 레이아웃 설정
st.set_page_config(layout="wide", page_title="Repellent Dashboard")

# MySQL 데이터베이스 연결
engine = create_engine('mysql+pymysql://kku:kkukku415@localhost:3306/repellerDB')

# 자동 새로고침 설정 (5분마다 새로고침)
st_autorefresh(interval=5 * 60 * 1000, key="datarefresh")

# 데이터 로드 함수
@st.cache_data
def load_data():
    query = "SELECT * FROM repellent_data"
    df = pd.read_sql(query, engine)
    df = df.sort_values(by='detection_date', ascending=False)
    return df

df = load_data()

# 데이터 테이블 표시 함수
def display_table(df):
    gb = GridOptionsBuilder.from_dataframe(df)
    gb.configure_pagination(paginationAutoPageSize=True)
    gb.configure_columns(df.columns, wrapText=True, autoHeight=True)
    grid_options = gb.build()
    AgGrid(df, gridOptions=grid_options, height=500, width='100%')

# 탭 레이아웃 구성
tab1, tab2, tab3 = st.tabs(["Data Table", "Visualizations", "Analysis"])

# Tab 1: 데이터 테이블
tab1.markdown("### Data Overview")
display_table(df)

# Tab 2: 시각화
tab2.markdown("### Visualizations")
cols = tab2.columns(2)

with cols[0]:
    tab2.markdown("#### Species Distribution")
    if 'species' in df.columns and 'birdCount' in df.columns:
        fig_species_donut = px.pie(
            df,
            names='species',
            values='birdCount',
            hole=0.4,
            color='species',
            color_discrete_sequence=px.colors.qualitative.Pastel
        )
        st.plotly_chart(fig_species_donut, use_container_width=True)

with cols[1]:
    tab2.markdown("#### Detection Type Distribution")
    if 'detection_type' in df.columns and 'birdCount' in df.columns:
        detection_type_counts = df.groupby('detection_type')['birdCount'].sum().reset_index()
        fig_detection_donut = px.pie(
            detection_type_counts,
            names='detection_type',
            values='birdCount',
            hole=0.4,
            color='detection_type',
            color_discrete_sequence=px.colors.qualitative.Set3
        )
        st.plotly_chart(fig_detection_donut, use_container_width=True)

with tab2:
    st.markdown("#### Bird Count Over Time")
    if 'detection_date' in df.columns and 'birdCount' in df.columns:
        time_series = px.line(
            df.groupby('detection_date')['birdCount'].sum().reset_index(),
            x='detection_date',
            y='birdCount',
            title='Bird Count Over Time',
            markers=True,
            template='plotly_white'
        )
        st.plotly_chart(time_series, use_container_width=True)

# Tab 3: 분석 탭
with tab3:
    st.markdown("### Detailed Analysis")
    st.markdown("#### Top 5 Species by Bird Count")
    if 'species' in df.columns and 'birdCount' in df.columns:
        top_species = df.groupby('species')['birdCount'].sum().nlargest(5).reset_index()
        bar_chart = px.bar(
            top_species,
            x='species',
            y='birdCount',
            text='birdCount',
            color='species',
            title='Top 5 Species',
            template='plotly_white'
        )
        bar_chart.update_traces(texttemplate='%{text}', textposition='outside')
        st.plotly_chart(bar_chart, use_container_width=True)

    st.markdown("#### Species vs Detection Type Heatmap")
    if 'species' in df.columns and 'detection_type' in df.columns and 'birdCount' in df.columns:
        heatmap_data = df.groupby(['species', 'detection_type'])['birdCount'].sum().reset_index()
        heatmap = px.density_heatmap(
            heatmap_data,
            x='species',
            y='detection_type',
            z='birdCount',
            color_continuous_scale='Viridis',
            title='Species vs Detection Type'
        )
        st.plotly_chart(heatmap, use_container_width=True)
