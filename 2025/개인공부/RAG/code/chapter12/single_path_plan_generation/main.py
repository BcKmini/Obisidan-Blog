import operator
from datetime import datetime
from typing import Annotated, Any

from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import create_react_agent
from passive_goal_creator.main import Goal, PassiveGoalCreator
from prompt_optimizer.main import OptimizedGoal, PromptOptimizer
from pydantic import BaseModel, Field
from response_optimizer.main import ResponseOptimizer


class DecomposedTasks(BaseModel):
    values: list[str] = Field(
        default_factory=list,
        min_items=3,
        max_items=5,
        description="3~5개로 분해된 태스크",
    )


class SinglePathPlanGenerationState(BaseModel):
    query: str = Field(..., description="사용자가 입력한 쿼리")
    optimized_goal: str = Field(default="", description="최적화된 목표")
    optimized_response: str = Field(
        default="", description="최적화된 응답 정의"
    )
    tasks: list[str] = Field(default_factory=list, description="실행할 태스크 리스트")
    current_task_index: int = Field(default=0, description="현재 실행 중인 태스크 번호")
    results: Annotated[list[str], operator.add] = Field(
        default_factory=list, description="실행 완료된 태스크 결과 리스트"
    )
    final_output: str = Field(default="", description="최종 출력 결과")


class QueryDecomposer:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm
        self.current_date = datetime.now().strftime("%Y-%m-%d")

    def run(self, query: str) -> DecomposedTasks:
        prompt = ChatPromptTemplate.from_template(
            f"CURRENT_DATE: {self.current_date}\n"
            "-----\n"
            "태스크: 주어진 목표를 구체적이고 실행 가능한 태스크로 분해해 주세요.\n"
            "요건:\n"
            "1. 다음 행동만으로 목표를 달성할 것. 절대 지정된 이외의 행동을 취하지 말 것.\n"
            "   - 인터넷을 이용하여 목표 달성을 위한 조사를 수행한다.\n"
            "2. 각 태스크는 구체적이고 상세하게 기재하며, 단독으로 실행 및 검증 가능한 정보를 포함할 것. 추상적인 표현을 일절 포함하지 말 것.\n"
            "3. 태스크는 실행 가능한 순서로 리스트화할 것.\n"
            "4. 태스크는 한국어로 출력할 것.\n"
            "목표: {query}"
        )
        chain = prompt | self.llm.with_structured_output(DecomposedTasks)
        return chain.invoke({"query": query})


class TaskExecutor:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm
        self.tools = [TavilySearchResults(max_results=3)]

    def run(self, task: str) -> str:
        agent = create_react_agent(self.llm, self.tools)
        result = agent.invoke(
            {
                "messages": [
                    (
                        "human",
                        (
                            "다음 태스크를 실행하고 상세한 답변을 제공해 주세요.\n\n"
                            f"태스크: {task}\n\n"
                            "요건:\n"
                            "1. 필요에 따라 제공된 도구를 사용하세요.\n"
                            "2. 실행은 철저하고 포괄적으로 수행하세요.\n"
                            "3. 가능한 한 구체적인 사실이나 데이터를 제공하세요.\n"
                            "4. 발견한 내용을 명확하게 요약하세요.\n"
                        ),
                    )
                ]
            }
        )
        return result["messages"][-1].content


class ResultAggregator:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm

    def run(self, query: str, response_definition: str, results: list[str]) -> str:
        prompt = ChatPromptTemplate.from_template(
            "주어진 목표:\n{query}\n\n"
            "조사 결과:\n{results}\n\n"
            "주어진 목표에 대해 조사 결과를 활용하여 다음 지시에 기반한 응답을 생성해 주세요.\n"
            "{response_definition}"
        )
        results_str = "\n\n".join(
            f"Info {i+1}:\n{result}" for i, result in enumerate(results)
        )
        chain = prompt | self.llm | StrOutputParser()
        return chain.invoke(
            {
                "query": query,
                "results": results_str,
                "response_definition": response_definition,
            }
        )


class SinglePathPlanGeneration:
    def __init__(self, llm: ChatOpenAI):
        self.passive_goal_creator = PassiveGoalCreator(llm=llm)
        self.prompt_optimizer = PromptOptimizer(llm=llm)
        self.response_optimizer = ResponseOptimizer(llm=llm)
        self.query_decomposer = QueryDecomposer(llm=llm)
        self.task_executor = TaskExecutor(llm=llm)
        self.result_aggregator = ResultAggregator(llm=llm)
        self.graph = self._create_graph()

    def _create_graph(self) -> StateGraph:
        graph = StateGraph(SinglePathPlanGenerationState)
        graph.add_node("goal_setting", self._goal_setting)
        graph.add_node("decompose_query", self._decompose_query)
        graph.add_node("execute_task", self._execute_task)
        graph.add_node("aggregate_results", self._aggregate_results)
        graph.set_entry_point("goal_setting")
        graph.add_edge("goal_setting", "decompose_query")
        graph.add_edge("decompose_query", "execute_task")
        graph.add_conditional_edges(
            "execute_task",
            lambda state: state.current_task_index < len(state.tasks),
            {True: "execute_task", False: "aggregate_results"},
        )
        graph.add_edge("aggregate_results", END)
        return graph.compile()

    def _goal_setting(self, state: SinglePathPlanGenerationState) -> dict[str, Any]:
        # 프롬프트 최적화
        goal: Goal = self.passive_goal_creator.run(query=state.query)
        optimized_goal: OptimizedGoal = self.prompt_optimizer.run(query=goal.text)
        # 응답 최적화
        optimized_response: str = self.response_optimizer.run(query=optimized_goal.text)
        return {
            "optimized_goal": optimized_goal.text,
            "optimized_response": optimized_response,
        }

    def _decompose_query(self, state: SinglePathPlanGenerationState) -> dict[str, Any]:
        decomposed_tasks: DecomposedTasks = self.query_decomposer.run(
            query=state.optimized_goal
        )
        return {"tasks": decomposed_tasks.values}

    def _execute_task(self, state: SinglePathPlanGenerationState) -> dict[str, Any]:
        current_task = state.tasks[state.current_task_index]
        result = self.task_executor.run(task=current_task)
        return {
            "results": [result],
            "current_task_index": state.current_task_index + 1,
        }

    def _aggregate_results(
        self, state: SinglePathPlanGenerationState
    ) -> dict[str, Any]:
        final_output = self.result_aggregator.run(
            query=state.optimized_goal,
            response_definition=state.optimized_response,
            results=state.results,
        )
        return {"final_output": final_output}

    def run(self, query: str) -> str:
        initial_state = SinglePathPlanGenerationState(query=query)
        final_state = self.graph.invoke(initial_state, {"recursion_limit": 1000})
        return final_state.get("final_output", "최종 응답을 생성하지 못했습니다.")


def main():
    import argparse

    from settings import Settings

    settings = Settings()

    parser = argparse.ArgumentParser(
        description="SinglePathPlanGeneration을 사용하여 태스크를 실행합니다"
    )
    parser.add_argument("--task", type=str, required=True, help="실행할 태스크")
    args = parser.parse_args()

    llm = ChatOpenAI(
        model=settings.openai_smart_model, temperature=settings.temperature
    )
    agent = SinglePathPlanGeneration(llm=llm)
    result = agent.run(args.task)
    print(result)


if __name__ == "__main__":
    main()
