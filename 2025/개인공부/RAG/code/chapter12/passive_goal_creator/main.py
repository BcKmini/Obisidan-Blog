from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field


class Goal(BaseModel):
    description: str = Field(..., description="목표 설명")

    @property
    def text(self) -> str:
        return f"{self.description}"


class PassiveGoalCreator:
    def __init__(
        self,
        llm: ChatOpenAI,
    ):
        self.llm = llm

    def run(self, query: str) -> Goal:
        prompt = ChatPromptTemplate.from_template(
            "사용자 입력을 분석하여 명확하고 실행 가능한 목표를 생성해 주세요.\n"
            "요건:\n"
            "1. 목표는 구체적이고 명확해야 하며, 실행 가능한 수준으로 상세화되어야 합니다.\n"
            "2. 당신이 실행할 수 있는 행동은 다음과 같은 행동뿐입니다.\n"
            "   - 인터넷을 이용하여 목표 달성을 위한 조사를 수행합니다.\n"
            "   - 사용자를 위한 보고서를 생성합니다.\n"
            "3. 절대 2.에 명시된 행동 외의 다른 행동을 취해서는 안 됩니다.\n"
            "사용자 입력: {query}"
        )
        chain = prompt | self.llm.with_structured_output(Goal)
        return chain.invoke({"query": query})


def main():
    import argparse

    from settings import Settings

    settings = Settings()

    parser = argparse.ArgumentParser(
        description="PassiveGoalCreator를 사용하여 목표를 생성합니다"
    )
    parser.add_argument("--task", type=str, required=True, help="실행할 태스크")
    args = parser.parse_args()

    llm = ChatOpenAI(
        model=settings.openai_smart_model, temperature=settings.temperature
    )
    goal_creator = PassiveGoalCreator(llm=llm)
    result: Goal = goal_creator.run(query=args.task)

    print(f"{result.text}")


if __name__ == "__main__":
    main()
