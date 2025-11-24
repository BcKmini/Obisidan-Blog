import operator
from typing import Annotated, Any, Optional

from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph
from pydantic import BaseModel, Field

# .env 파일에서 환경 변수 불러오기
load_dotenv()


# 페르소나를 표현하는 데이터 모델
class Persona(BaseModel):
    name: str = Field(..., description="페르소나의 이름")
    background: str = Field(..., description="페르소나의 배경")


# 페르소나 목록을 표현하는 데이터 모델
class Personas(BaseModel):
    personas: list[Persona] = Field(
        default_factory=list, description="페르소나 목록"
    )


# 인터뷰 내용을 표현하는 데이터 모델
class Interview(BaseModel):
    persona: Persona = Field(..., description="인터뷰 대상 페르소나")
    question: str = Field(..., description="인터뷰 질문")
    answer: str = Field(..., description="인터뷰 답변")


# 인터뷰 결과 목록을 표현하는 데이터 모델
class InterviewResult(BaseModel):
    interviews: list[Interview] = Field(
        default_factory=list, description="인터뷰 결과 목록"
    )


# 평가 결과를 표현하는 데이터 모델
class EvaluationResult(BaseModel):
    reason: str = Field(..., description="판단 이유")
    is_sufficient: bool = Field(..., description="정보가 충분한지 여부")


# 요구사항 정의 생성 AI 에이전트의 상태
class InterviewState(BaseModel):
    user_request: str = Field(..., description="사용자 요청")
    personas: Annotated[list[Persona], operator.add] = Field(
        default_factory=list, description="생성된 페르소나 목록"
    )
    interviews: Annotated[list[Interview], operator.add] = Field(
        default_factory=list, description="실시된 인터뷰 목록"
    )
    requirements_doc: str = Field(default="", description="생성된 요구사항 정의")
    iteration: int = Field(
        default=0, description="페르소나 생성과 인터뷰의 반복 횟수"
    )
    is_information_sufficient: bool = Field(
        default=False, description="정보가 충분한지 여부"
    )


# 페르소나를 생성하는 클래스
class PersonaGenerator:
    def __init__(self, llm: ChatOpenAI, k: int = 5):
        self.llm = llm.with_structured_output(Personas)
        self.k = k

    def run(self, user_request: str) -> Personas:
        # 프롬프트 템플릿 정의
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "당신은 사용자 인터뷰용 다양한 페르소나를 만드는 전문가입니다.",
                ),
                (
                    "human",
                    f"다음 사용자 요청에 관한 인터뷰를 위해 {self.k}명의 다양한 페르소나를 생성해주세요.\n\n"
                    "사용자 요청: {user_request}\n\n"
                    "각 페르소나에는 이름과 간단한 배경을 포함해주세요. 나이, 성별, 직업, 기술적 전문 지식에서 다양성을 확보해 주세요.",
                ),
            ]
        )
        # 페르소나 생성을 위한 체인 생성
        chain = prompt | self.llm
        # 페르소나 생성
        return chain.invoke({"user_request": user_request})


# 인터뷰를 실시하는 클래스
class InterviewConductor:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm

    def run(self, user_request: str, personas: list[Persona]) -> InterviewResult:
        # 질문 생성
        questions = self._generate_questions(
            user_request=user_request, personas=personas
        )
        # 답변 생성
        answers = self._generate_answers(personas=personas, questions=questions)
        # 질문과 답변의 조합으로 인터뷰 목록 생성
        interviews = self._create_interviews(
            personas=personas, questions=questions, answers=answers
        )
        # 인터뷰 결과 반환
        return InterviewResult(interviews=interviews)

    def _generate_questions(
        self, user_request: str, personas: list[Persona]
    ) -> list[str]:
        # 질문 생성을 위한 프롬프트 정의
        question_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "당신은 사용자 요구사항에 기반하여 적절한 질문을 생성하는 전문가입니다.",
                ),
                (
                    "human",
                    "다음 페르소나와 관련된 사용자 요청에 대해 한 가지 질문을 생성해 주세요.\n\n"
                    "사용자 요청: {user_request}\n"
                    "페르소나: {persona_name} - {persona_background}\n\n"
                    "질문은 구체적이고, 이 페르소나의 관점에서 중요한 정보를 이끌어낼 수 있도록 설계해 주세요.",
                ),
            ]
        )
        # 질문 생성을 위한 체인 생성
        question_chain = question_prompt | self.llm | StrOutputParser()

        # 각 페르소나에 대한 질문 쿼리 생성
        question_queries = [
            {
                "user_request": user_request,
                "persona_name": persona.name,
                "persona_background": persona.background,
            }
            for persona in personas
        ]
        # 질문을 배치 처리로 생성
        return question_chain.batch(question_queries)

    def _generate_answers(
        self, personas: list[Persona], questions: list[str]
    ) -> list[str]:
        # 답변 생성을 위한 프롬프트 정의
        answer_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "당신은 다음 페르소나로서 답변하고 있습니다: {persona_name} - {persona_background}",
                ),
                ("human", "질문: {question}"),
            ]
        )
        # 답변 생성을 위한 체인 생성
        answer_chain = answer_prompt | self.llm | StrOutputParser()

        # 각 페르소나에 대한 답변 쿼리 생성
        answer_queries = [
            {
                "persona_name": persona.name,
                "persona_background": persona.background,
                "question": question,
            }
            for persona, question in zip(personas, questions)
        ]
        # 답변을 배치 처리로 생성
        return answer_chain.batch(answer_queries)

    def _create_interviews(
        self, personas: list[Persona], questions: list[str], answers: list[str]
    ) -> list[Interview]:
        # 페르소나별로 질문과 답변의 조합으로 인터뷰 객체 생성
        return [
            Interview(persona=persona, question=question, answer=answer)
            for persona, question, answer in zip(personas, questions, answers)
        ]


# 정보의 충분성을 평가하는 클래스
class InformationEvaluator:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm.with_structured_output(EvaluationResult)

    # 사용자 요청과 인터뷰 결과를 기반으로 정보의 충분성을 평가
    def run(self, user_request: str, interviews: list[Interview]) -> EvaluationResult:
        # 프롬프트 정의
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "당신은 포괄적인 요구사항 문서를 작성하기 위한 정보의 충분성을 평가하는 전문가입니다.",
                ),
                (
                    "human",
                    "다음 사용자 요청과 인터뷰 결과에 기반하여, 포괄적인 요구사항 문서를 작성하기에 충분한 정보가 모였는지 판단해 주세요.\n\n"
                    "사용자 요청: {user_request}\n\n"
                    "인터뷰 결과:\n{interview_results}",
                ),
            ]
        )
        # 정보의 충분성을 평가하는 체인 생성
        chain = prompt | self.llm
        # 평가 결과 반환
        return chain.invoke(
            {
                "user_request": user_request,
                "interview_results": "\n".join(
                    f"페르소나: {i.persona.name} - {i.persona.background}\n"
                    f"질문: {i.question}\n답변: {i.answer}\n"
                    for i in interviews
                ),
            }
        )


# 요구사항 정의서를 생성하는 클래스
class RequirementsDocumentGenerator:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm

    def run(self, user_request: str, interviews: list[Interview]) -> str:
        # 프롬프트 정의
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "당신은 수집한 정보를 바탕으로 요구사항 문서를 작성하는 전문가입니다.",
                ),
                (
                    "human",
                    "다음 사용자 요청과 여러 페르소나의 인터뷰 결과에 기반하여, 요구사항 문서를 작성해 주세요.\n\n"
                    "사용자 요청: {user_request}\n\n"
                    "인터뷰 결과:\n{interview_results}\n"
                    "요구사항 문서에는 다음 섹션을 포함해주세요:\n"
                    "1. 프로젝트 개요\n"
                    "2. 주요 기능\n"
                    "3. 비기능 요구사항\n"
                    "4. 제약 조건\n"
                    "5. 타겟 사용자\n"
                    "6. 우선순위\n"
                    "7. 리스크와 완화 방안\n\n"
                    "출력은 반드시 한국어로 부탁드립니다.\n\n요구사항 문서:",
                ),
            ]
        )
        # 요구사항 정의서를 생성하는 체인 생성
        chain = prompt | self.llm | StrOutputParser()
        # 요구사항 정의서 생성
        return chain.invoke(
            {
                "user_request": user_request,
                "interview_results": "\n".join(
                    f"페르소나: {i.persona.name} - {i.persona.background}\n"
                    f"질문: {i.question}\n답변: {i.answer}\n"
                    for i in interviews
                ),
            }
        )


# 요구사항 정의서 생성 AI 에이전트 클래스
class DocumentationAgent:
    def __init__(self, llm: ChatOpenAI, k: Optional[int] = None):
        # 각종 제너레이터 초기화
        self.persona_generator = PersonaGenerator(llm=llm, k=k)
        self.interview_conductor = InterviewConductor(llm=llm)
        self.information_evaluator = InformationEvaluator(llm=llm)
        self.requirements_generator = RequirementsDocumentGenerator(llm=llm)

        # 그래프 생성
        self.graph = self._create_graph()

    def _create_graph(self) -> StateGraph:
        # 그래프 초기화
        workflow = StateGraph(InterviewState)

        # 각 노드 추가
        workflow.add_node("generate_personas", self._generate_personas)
        workflow.add_node("conduct_interviews", self._conduct_interviews)
        workflow.add_node("evaluate_information", self._evaluate_information)
        workflow.add_node("generate_requirements", self._generate_requirements)

        # 엔트리 포인트 설정
        workflow.set_entry_point("generate_personas")

        # 노드 간 엣지 추가
        workflow.add_edge("generate_personas", "conduct_interviews")
        workflow.add_edge("conduct_interviews", "evaluate_information")

        # 조건부 엣지 추가
        workflow.add_conditional_edges(
            "evaluate_information",
            lambda state: not state.is_information_sufficient and state.iteration < 5,
            {True: "generate_personas", False: "generate_requirements"},
        )
        workflow.add_edge("generate_requirements", END)

        # 그래프 컴파일
        return workflow.compile()

    def _generate_personas(self, state: InterviewState) -> dict[str, Any]:
        # 페르소나 생성
        new_personas: Personas = self.persona_generator.run(state.user_request)
        return {
            "personas": new_personas.personas,
            "iteration": state.iteration + 1,
        }

    def _conduct_interviews(self, state: InterviewState) -> dict[str, Any]:
        # 인터뷰 실시
        new_interviews: InterviewResult = self.interview_conductor.run(
            state.user_request, state.personas[-5:]
        )
        return {"interviews": new_interviews.interviews}

    def _evaluate_information(self, state: InterviewState) -> dict[str, Any]:
        # 정보 평가
        evaluation_result: EvaluationResult = self.information_evaluator.run(
            state.user_request, state.interviews
        )
        return {
            "is_information_sufficient": evaluation_result.is_sufficient,
            "evaluation_reason": evaluation_result.reason,
        }

    def _generate_requirements(self, state: InterviewState) -> dict[str, Any]:
        # 요구사항 정의서 생성
        requirements_doc: str = self.requirements_generator.run(
            state.user_request, state.interviews
        )
        return {"requirements_doc": requirements_doc}

    def run(self, user_request: str) -> str:
        # 초기 상태 설정
        initial_state = InterviewState(user_request=user_request)
        # 그래프 실행
        final_state = self.graph.invoke(initial_state)
        # 최종 요구사항 정의서 반환
        return final_state["requirements_doc"]


# 실행 방법:
# poetry run python -m documentation_agent.main --task "여기에 사용자 요청을 입력하세요"
# 실행 예)
# poetry run python -m documentation_agent.main --task "스마트폰용 건강 관리 앱을 개발하고 싶다"
def main():
    import argparse

    # 커맨드 라인 인자 파서 생성
    parser = argparse.ArgumentParser(
        description="사용자 요구에 기반하여 요구사항 정의를 생성합니다"
    )
    # "task" 인자 추가
    parser.add_argument(
        "--task",
        type=str,
        help="개발하고 싶은 애플리케이션에 대해 기술해 주세요",
    )
    # "k" 인자 추가
    parser.add_argument(
        "--k",
        type=int,
        default=5,
        help="생성할 페르소나 수를 설정하세요(기본값: 5)",
    )
    # 커맨드 라인 인자 파싱
    args = parser.parse_args()

    # ChatOpenAI 모델 초기화
    llm = ChatOpenAI(model="gpt-4o", temperature=0.0)
    # 요구사항 정의서 생성 AI 에이전트 초기화
    agent = DocumentationAgent(llm=llm, k=args.k)
    # 에이전트 실행하여 최종 출력 얻기
    final_output = agent.run(user_request=args.task)

    # 최종 출력 표시
    print(final_output)


if __name__ == "__main__":
    main()
