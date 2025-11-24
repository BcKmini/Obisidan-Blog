import operator
from datetime import datetime
from typing import Annotated, Any

from common.reflection_manager import Reflection, ReflectionManager, TaskReflector
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


def format_reflections(reflections: list[Reflection]) -> str:
    return (
        "\n\n".join(
            f"<ref_{i}><task>{r.task}</task><reflection>{r.reflection}</reflection></ref_{i}>"
            for i, r in enumerate(reflections)
        )
        if reflections
        else "No relevant past reflections."
    )


class DecomposedTasks(BaseModel):
    values: list[str] = Field(
        default_factory=list,
        min_items=3,
        max_items=5,
        description="3~5개로 분해된 태스크",
    )


class ReflectiveAgentState(BaseModel):
    query: str = Field(..., description="사용자가 처음에 입력한 쿼리")
    optimized_goal: str = Field(default="", description="최적화된 목표")
    optimized_response: str = Field(
        default="", description="최적화된 응답 정의"
    )
    tasks: list[str] = Field(default_factory=list, description="실행할 태스크 목록")
    current_task_index: int = Field(default=0, description="현재 실행 중인 태스크 번호")
    results: Annotated[list[str], operator.add] = Field(
        default_factory=list, description="실행 완료된 태스크 결과 목록"
    )
    reflection_ids: Annotated[list[str], operator.add] = Field(
        default_factory=list, description="리플렉션 결과의 ID 목록"
    )
    final_output: str = Field(default="", description="최종 출력 결과")
    retry_count: int = Field(default=0, description="태스크 재시도 횟수")


class ReflectiveGoalCreator:
    def __init__(self, llm: ChatOpenAI, reflection_manager: ReflectionManager):
        self.llm = llm
        self.reflection_manager = reflection_manager
        self.passive_goal_creator = PassiveGoalCreator(llm=self.llm)
        self.prompt_optimizer = PromptOptimizer(llm=self.llm)

    def run(self, query: str) -> str:
        relevant_reflections = self.reflection_manager.get_relevant_reflections(query)
        reflection_text = format_reflections(relevant_reflections)

        query = f"{query}\n\n목표 설정 시 다음의 과거 회고를 고려할 것:\n{reflection_text}"
        goal: Goal = self.passive_goal_creator.run(query=query)
        optimized_goal: OptimizedGoal = self.prompt_optimizer.run(query=goal.text)
        return optimized_goal.text


class ReflectiveResponseOptimizer:
    def __init__(self, llm: ChatOpenAI, reflection_manager: ReflectionManager):
        self.llm = llm
        self.reflection_manager = reflection_manager
        self.response_optimizer = ResponseOptimizer(llm=llm)

    def run(self, query: str) -> str:
        relevant_reflections = self.reflection_manager.get_relevant_reflections(query)
        reflection_text = format_reflections(relevant_reflections)

        query = f"{query}\n\n응답 최적화에 다음의 과거 회고를 고려할 것:\n{reflection_text}"
        optimized_response: str = self.response_optimizer.run(query=query)
        return optimized_response


class QueryDecomposer:
    def __init__(self, llm: ChatOpenAI, reflection_manager: ReflectionManager):
        self.llm = llm.with_structured_output(DecomposedTasks)
        self.current_date = datetime.now().strftime("%Y-%m-%d")
        self.reflection_manager = reflection_manager

    def run(self, query: str) -> DecomposedTasks:
        relevant_reflections = self.reflection_manager.get_relevant_reflections(query)
        reflection_text = format_reflections(relevant_reflections)
        prompt = ChatPromptTemplate.from_template(
            f"CURRENT_DATE: {self.current_date}\n"
            "-----\n"
            "태스크: 주어진 목표를 구체적이고 실행 가능한 태스크로 분해해 주세요.\n"
            "요건:\n"
            "1. 다음 행동만으로 목표를 달성할 것. 절대 지정된 것 외의 행동을 취하지 말 것.\n"
            "   - 인터넷을 이용하여 목표 달성을 위한 조사를 수행한다.\n"
            "2. 각 태스크는 구체적이고 상세하게 작성되어 있으며, 독립적으로 실행 및 검증 가능한 정보를 포함할 것. 추상적인 표현을 전혀 포함하지 않을 것.\n"
            "3. 태스크는 실행 가능한 순서로 나열할 것.\n"
            "4. 태스크는 한국어로 출력할 것.\n"
            "5. 태스크를 작성할 때 다음의 과거 회고를 고려할 것:\n{reflections}\n\n"
            "목표: {query}"
        )
        chain = prompt | self.llm
        tasks = chain.invoke({"query": query, "reflections": reflection_text})
        return tasks


class TaskExecutor:
    def __init__(self, llm: ChatOpenAI, reflection_manager: ReflectionManager):
        self.llm = llm
        self.reflection_manager = reflection_manager
        self.current_date = datetime.now().strftime("%Y-%m-%d")
        self.tools = [TavilySearchResults(max_results=3)]

    def run(self, task: str) -> str:
        relevant_reflections = self.reflection_manager.get_relevant_reflections(task)
        reflection_text = format_reflections(relevant_reflections)
        agent = create_react_agent(self.llm, self.tools)
        result = agent.invoke(
            {
                "messages": [
                    (
                        "human",
                        f"CURRENT_DATE: {self.current_date}\n"
                        "-----\n"
                        f"다음 태스크를 실행하고 상세한 답변을 제공해 주세요.\n\n태스크: {task}\n\n"
                        "요건:\n"
                        "1. 필요에 따라 제공된 도구를 사용할 것.\n"
                        "2. 실행 시 철저하고 포괄적일 것.\n"
                        "3. 가능한 한 구체적인 사실과 데이터를 제공할 것.\n"
                        "4. 발견 사항을 명확하게 요약할 것.\n"
                        f"5. 다음의 과거 회고를 고려할 것:\n{reflection_text}\n",
                    )
                ]
            }
        )
        return result["messages"][-1].content


class ResultAggregator:
    def __init__(self, llm: ChatOpenAI, reflection_manager: ReflectionManager):
        self.llm = llm
        self.reflection_manager = reflection_manager
        self.current_date = datetime.now().strftime("%Y-%m-%d")

    def run(
        self,
        query: str,
        results: list[str],
        reflection_ids: list[str],
        response_definition: str,
    ) -> str:
        relevant_reflections = [
            self.reflection_manager.get_reflection(rid) for rid in reflection_ids
        ]
        prompt = ChatPromptTemplate.from_template(
            "주어진 목표:\n{query}\n\n"
            "조사 결과:\n{results}\n\n"
            "주어진 목표에 대해 조사 결과를 이용하여 다음 지시에 기반한 응답을 생성해 주세요.\n"
            "{response_definition}\n\n"
            "과거 회고를 고려할 것:\n{reflection_text}\n"
        )
        chain = prompt | self.llm | StrOutputParser()
        return chain.invoke(
            {
                "query": query,
                "results": "\n\n".join(
                    f"정보 {i+1}:\n{result}" for i, result in enumerate(results)
                ),
                "response_definition": response_definition,
                "reflection_text": format_reflections(relevant_reflections),
            }
        )


class ReflectiveAgent:
    def __init__(
        self,
        llm: ChatOpenAI,
        reflection_manager: ReflectionManager,
        task_reflector: TaskReflector,
        max_retries: int = 2,
    ):
        self.reflection_manager = reflection_manager
        self.task_reflector = task_reflector
        self.reflective_goal_creator = ReflectiveGoalCreator(
            llm=llm, reflection_manager=self.reflection_manager
        )
        self.reflective_response_optimizer = ReflectiveResponseOptimizer(
            llm=llm, reflection_manager=self.reflection_manager
        )
        self.query_decomposer = QueryDecomposer(
            llm=llm, reflection_manager=self.reflection_manager
        )
        self.task_executor = TaskExecutor(
            llm=llm, reflection_manager=self.reflection_manager
        )
        self.result_aggregator = ResultAggregator(
            llm=llm, reflection_manager=self.reflection_manager
        )
        self.max_retries = max_retries
        self.graph = self._create_graph()

    def _create_graph(self) -> StateGraph:
        graph = StateGraph(ReflectiveAgentState)
        graph.add_node("goal_setting", self._goal_setting)
        graph.add_node("decompose_query", self._decompose_query)
        graph.add_node("execute_task", self._execute_task)
        graph.add_node("reflect_on_task", self._reflect_on_task)
        graph.add_node("update_task_index", self._update_task_index)
        graph.add_node("aggregate_results", self._aggregate_results)
        graph.set_entry_point("goal_setting")
        graph.add_edge("goal_setting", "decompose_query")
        graph.add_edge("decompose_query", "execute_task")
        graph.add_edge("execute_task", "reflect_on_task")
        graph.add_conditional_edges(
            "reflect_on_task",
            self._should_retry_or_continue,
            {
                "retry": "execute_task",
                "continue": "update_task_index",
                "finish": "aggregate_results",
            },
        )
        graph.add_edge("update_task_index", "execute_task")
        graph.add_edge("aggregate_results", END)
        return graph.compile()

    def _goal_setting(self, state: ReflectiveAgentState) -> dict[str, Any]:
        optimized_goal: str = self.reflective_goal_creator.run(query=state.query)
        optimized_response: str = self.reflective_response_optimizer.run(
            query=optimized_goal
        )
        return {
            "optimized_goal": optimized_goal,
            "optimized_response": optimized_response,
        }

    def _decompose_query(self, state: ReflectiveAgentState) -> dict[str, Any]:
        tasks: DecomposedTasks = self.query_decomposer.run(query=state.optimized_goal)
        return {"tasks": tasks.values}

    def _execute_task(self, state: ReflectiveAgentState) -> dict[str, Any]:
        current_task = state.tasks[state.current_task_index]
        result = self.task_executor.run(task=current_task)
        return {"results": [result], "current_task_index": state.current_task_index}

    def _reflect_on_task(self, state: ReflectiveAgentState) -> dict[str, Any]:
        current_task = state.tasks[state.current_task_index]
        current_result = state.results[-1]
        reflection = self.task_reflector.run(task=current_task, result=current_result)
        return {
            "reflection_ids": [reflection.id],
            "retry_count": (
                state.retry_count + 1 if reflection.judgment.needs_retry else 0
            ),
        }

    def _should_retry_or_continue(self, state: ReflectiveAgentState) -> str:
        latest_reflection_id = state.reflection_ids[-1]
        latest_reflection = self.reflection_manager.get_reflection(latest_reflection_id)
        if (
            latest_reflection
            and latest_reflection.judgment.needs_retry
            and state.retry_count < self.max_retries
        ):
            return "retry"
        elif state.current_task_index < len(state.tasks) - 1:
            return "continue"
        else:
            return "finish"

    def _update_task_index(self, state: ReflectiveAgentState) -> dict[str, Any]:
        return {"current_task_index": state.current_task_index + 1}

    def _aggregate_results(self, state: ReflectiveAgentState) -> dict[str, Any]:
        final_output = self.result_aggregator.run(
            query=state.optimized_goal,
            results=state.results,
            reflection_ids=state.reflection_ids,
            response_definition=state.optimized_response,
        )
        return {"final_output": final_output}

    def run(self, query: str) -> str:
        initial_state = ReflectiveAgentState(query=query)
        final_state = self.graph.invoke(initial_state, {"recursion_limit": 1000})
        return final_state.get("final_output", "오류: 출력에 실패했습니다.")


def main():
    import argparse

    from settings import Settings

    settings = Settings()

    parser = argparse.ArgumentParser(
        description="ReflectiveAgent를 사용해 태스크를 실행합니다(Self-reflection)"
    )
    parser.add_argument("--task", type=str, required=True, help="실행할 태스크")
    args = parser.parse_args()

    llm = ChatOpenAI(
        model=settings.openai_smart_model, temperature=settings.temperature
    )
    reflection_manager = ReflectionManager(file_path="tmp/self_reflection_db.json")
    task_reflector = TaskReflector(llm=llm, reflection_manager=reflection_manager)
    agent = ReflectiveAgent(
        llm=llm, reflection_manager=reflection_manager, task_reflector=task_reflector
    )
    result = agent.run(args.task)
    print(result)


if __name__ == "__main__":
    main()
