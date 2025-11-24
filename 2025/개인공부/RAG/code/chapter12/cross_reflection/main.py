from common.reflection_manager import ReflectionManager, TaskReflector
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from self_reflection.main import ReflectiveAgent


def main():
    import argparse

    from settings import Settings

    settings = Settings()

    parser = argparse.ArgumentParser(
        description="ReflectiveAgent를 사용해 태스크를 실행합니다(Cross-reflection)"
    )
    parser.add_argument("--task", type=str, required=True, help="실행할 태스크")
    args = parser.parse_args()

    # OpenAI LLM 초기화
    openai_llm = ChatOpenAI(
        model=settings.openai_smart_model, temperature=settings.temperature
    )

    # Anthropic LLM 초기화
    anthropic_llm = ChatAnthropic(
        model=settings.anthropic_smart_model, temperature=settings.temperature
    )

    # ReflectionManager 초기화
    reflection_manager = ReflectionManager(file_path="tmp/cross_reflection_db.json")

    # Anthropic LLM을 사용하는 TaskReflector 초기화
    anthropic_task_reflector = TaskReflector(
        llm=anthropic_llm, reflection_manager=reflection_manager
    )

    # ReflectiveAgent 초기화
    agent = ReflectiveAgent(
        llm=openai_llm,
        reflection_manager=reflection_manager,
        task_reflector=anthropic_task_reflector,
    )

    # 태스크를 실행하고 결과 획득
    result = agent.run(args.task)

    # 결과 출력
    print(result)


if __name__ == "__main__":
    main()
