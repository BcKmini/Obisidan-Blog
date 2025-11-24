from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from passive_goal_creator.main import Goal, PassiveGoalCreator
from prompt_optimizer.main import OptimizedGoal, PromptOptimizer


class ResponseOptimizer:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm

    def run(self, query: str) -> str:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "당신은 AI 에이전트 시스템의 응답 최적화 전문가입니다. 주어진 목표에 대해 에이전트가 목표에 맞는 응답을 반환하기 위한 응답 사양을 수립해 주세요.",
                ),
                (
                    "human",
                    "다음 절차에 따라 응답 최적화 프롬프트를 작성해 주세요:\n\n"
                    "1. 목표 분석:\n"
                    "제시된 목표를 분석하고 주요 요소와 의도를 파악해 주세요.\n\n"
                    "2. 응답 사양 수립:\n"
                    "목표 달성을 위한 최적의 응답 사양을 고안해 주세요. 톤, 구조, 내용의 초점 등을 고려해 주세요.\n\n"
                    "3. 구체적인 지침 작성:\n"
                    "사전에 수집된 정보에서 사용자의 기대에 부합하는 응답을 위해 필요한, AI 에이전트에 대한 명확하고 실행 가능한 지침을 작성해 주세요. 귀하의 지침으로 AI 에이전트가 수행할 수 있는 것은 이미 조사된 결과를 정리하는 것뿐입니다. 인터넷에 접근할 수 없습니다.\n\n"
                    "4. 예시 제공:\n"
                    "가능하다면, 목표에 맞는 응답의 예시를 하나 이상 포함해 주세요.\n\n"
                    "5. 평가 기준 설정:\n"
                    "응답의 효과를 측정하기 위한 기준을 정의해 주세요.\n\n"
                    "다음 구조로 응답 최적화 프롬프트를 출력해 주세요:\n\n"
                    "목표 분석:\n"
                    "[여기에 목표 분석 결과를 기입]\n\n"
                    "응답 사양:\n"
                    "[여기에 수립된 응답 사양을 기입]\n\n"
                    "AI 에이전트에 대한 지침:\n"
                    "[여기에 AI 에이전트에 대한 구체적인 지침을 기입]\n\n"
                    "응답 예시:\n"
                    "[여기에 응답 예시를 기입]\n\n"
                    "평가 기준:\n"
                    "[여기에 평가 기준을 기입]\n\n"
                    "그럼, 다음 목표에 대한 응답 최적화 프롬프트를 작성해 주세요:\n"
                    "{query}",
                ),
            ]
        )
        chain = prompt | self.llm | StrOutputParser()
        return chain.invoke({"query": query})


def main():
    import argparse

    from settings import Settings

    settings = Settings()

    parser = argparse.ArgumentParser(
        description="ResponseOptimizer를 이용하여 주어진 목표에 대해 최적화된 응답 정의를 생성합니다"
    )
    parser.add_argument("--task", type=str, required=True, help="실행할 태스크")
    args = parser.parse_args()

    llm = ChatOpenAI(
        model=settings.openai_smart_model, temperature=settings.temperature
    )

    passive_goal_creator = PassiveGoalCreator(llm=llm)
    goal: Goal = passive_goal_creator.run(query=args.task)

    prompt_optimizer = PromptOptimizer(llm=llm)
    optimized_goal: OptimizedGoal = prompt_optimizer.run(query=goal.text)

    response_optimizer = ResponseOptimizer(llm=llm)
    optimized_response: str = response_optimizer.run(query=optimized_goal.text)

    print(f"{optimized_response}")


if __name__ == "__main__":
    main()
