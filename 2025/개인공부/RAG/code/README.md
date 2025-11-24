# 랭체인과 랭그래프로 구현하는 RAG・AI 에이전트 실전 입문

《랭체인과 랭그래프로 구현하는 RAG・AI 에이전트 실전 입문》의 GitHub 저장소입니다.

## 각 장의 소스 코드

| 장                                                               | 소스 코드                                                                                                                                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 제1장 LLM 애플리케이션 개발의 기초                               | -                                                                                                                                                                                  |
| 제2장 OpenAI의 챗 API 기초                                       | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ychoi-kr/llm-agent/blob/main/chapter02/notebook.ipynb) |
| 제3장 프롬프트 엔지니어링                                        | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ychoi-kr/llm-agent/blob/main/chapter03/notebook.ipynb) |
| 제4장 LangChain의 기초                                           | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ychoi-kr/llm-agent/blob/main/chapter04/notebook.ipynb) |
| 제5장 LangChain Expression Language(LCEL) 심층 해설              | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ychoi-kr/llm-agent/blob/main/chapter05/notebook.ipynb) |
| 제6장 Advanced RAG                                               | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ychoi-kr/llm-agent/blob/main/chapter06/notebook.ipynb) |
| 제7장 LangSmith를 활용한 RAG 애플리케이션 평가                   | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ychoi-kr/llm-agent/blob/main/chapter07/notebook.ipynb) |
| 제8장 AI 에이전트란                                              | -                                                                                                                                                                                  |
| 제9장 LangGraph로 만드는 AI 에이전트 실전 입문                   | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ychoi-kr/llm-agent/blob/main/chapter09/notebook.ipynb) |
| 제10장 요구사항 정의서 생성 AI 에이전트 개발                     | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ychoi-kr/llm-agent/blob/main/chapter10/notebook.ipynb) |
| 제11장 에이전트 디자인 패턴                                      | -                                                                                                                                                                                  |
| 제12장 LangChain/LangGraph로 구현하는 에이전트 디자인 패턴       | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/ychoi-kr/llm-agent/blob/main/chapter12/notebook.ipynb) |

## 작동 확인 환경

본 책의 소스 코드는 다음 환경·버전에서 작동을 확인했습니다.

- Google Colab
- Python 3.10.12

Python 패키지의 작동 확인된 버전은 각 장의 디렉터리에 있는 requirements.txt를 참조하세요.

## 알려진 오류

### `TypeError: Client.__init__() got an unexpected keyword argument 'proxies'`

openai 패키지가 의존하는 httpx의 업데이트로 인해 `openai==1.40.6`을 사용하는 부분에서 `TypeError: Client.__init__() got an unexpected keyword argument 'proxies'`라는 오류가 발생하게 되었습니다.

이 오류는 `!pip install httpx==0.27.2`와 같이 httpx의 특정 버전을 설치하여 해결할 수 있습니다.

Google Colab에서 위 오류를 만난 후 `!pip install httpx==0.27.2`와 같이 패키지를 다시 설치한 경우, 다음 두 가지 작업 중 하나를 수행해야 합니다.

- Google Colab의 "런타임"에서 "세션 재시작"을 실행
- "런타임 연결 해제 및 삭제"를 실행하고 패키지 설치부터 다시 시작

### '7.4 Ragas를 활용한 합성 테스트 데이터 생성'에서의 RateLimitError

'7.4 Ragas를 활용한 합성 테스트 데이터 생성'에서 gpt-4o를 사용할 때 OpenAI API의 Usage tier에 따라 RateLimitError가 발생할 수 있습니다.

OpenAI API의 Usage tier에 관한 자세한 내용은 공식 문서의 다음 페이지를 참조하세요.

https://platform.openai.com/docs/guides/rate-limits/usage-tiers

이 오류가 발생한 경우 다음 두 가지 방법 중 하나로 대응하세요.

1. 같은 Tier에서도 gpt-4o보다 레이트 리밋이 높은 gpt-4o-mini 사용
   - 이 경우 생성되는 합성 테스트 데이터의 품질이 낮아질 수 있습니다
2. 과금 등을 통해 Tier 업그레이드
   - Tier 2에서는 RateLimitError가 발생하지 않는 것을 확인했습니다(2024년 10월 31일 기준)

#### 2025/3/15 추가

LangChain 문서의 증가로 인해, gpt-4o-mini를 사용하더라도 Tier 1에서는 오류가 발생한다는 보고가 있습니다.

이 경우, GitHub에서 문서를 로드하는 부분에서 다음과 같이 작동이 확인된 버전인 `langchain==0.2.13`을 지정하도록 하세요.

```python
loader = GitLoader(
    clone_url="https://github.com/langchain-ai/langchain",
    repo_path="./langchain",
    branch="langchain==0.2.13",
    file_filter=file_filter,
)
```
