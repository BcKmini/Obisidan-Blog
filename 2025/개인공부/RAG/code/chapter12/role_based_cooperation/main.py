import operator
from typing import Annotated, Any

from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import create_react_agent
from pydantic import BaseModel, Field
from single_path_plan_generation.main import DecomposedTasks, QueryDecomposer


class Role(BaseModel):
    name: str = Field(..., description="역할의 이름")
    description: str = Field(..., description="역할에 대한 상세 설명")
    key_skills: list[str] = Field(..., description="이 역할에 필요한 주요 스킬이나 속성")


class Task(BaseModel):
    description: str = Field(..., description="태스크 설명")
    role: Role = Field(default=None, description="태스크에 배정된 역할")


class TasksWithRoles(BaseModel):
    tasks: list[Task] = Field(..., description="역할이 배정된 태스크 목록")


class AgentState(BaseModel):
    query: str = Field(..., description="사용자가 입력한 쿼리")
    tasks: list[Task] = Field(
        default_factory=list, description="실행할 태스크 목록"
    )
    current_task_index: int = Field(default=0, description="현재 실행 중인 태스크의 번호")
    results: Annotated[list[str], operator.add] = Field(
        default_factory=list, description="실행 완료된 태스크의 결과 목록"
    )
    final_report: str = Field(default="", description="최종 출력 결과")


class Planner:
    def __init__(self, llm: ChatOpenAI):
        self.query_decomposer = QueryDecomposer(llm=llm)

    def run(self, query: str) -> list[Task]:
        decomposed_tasks: DecomposedTasks = self.query_decomposer.run(query=query)
        return [Task(description=task) for task in decomposed_tasks.values]


class RoleAssigner:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm.with_structured_output(TasksWithRoles)

    def run(self, tasks: list[Task]) -> list[Task]:
        prompt = ChatPromptTemplate(
            [
                (
                    "system",
                    (
                        "당신은 창의적인 역할 설계 전문가입니다. 주어진 태스크에 대해 독특하고 적절한 역할을 생성하세요."
                    ),
                ),
                (
                    "human",
                    (
                        "태스크:\n{tasks}\n\n"
                        "이러한 태스크에 대해 다음 지침에 따라 역할을 배정하세요:\n"
                        "1. 각 태스크에 대해 독창적이고 창의적인 역할을 고안하세요. 기존 직업명이나 일반적인 역할명에 얽매일 필요는 없습니다.\n"
                        "2. 역할명은 해당 태스크의 본질을 반영한 매력적이고 기억에 남는 것으로 지어주세요.\n"
                        "3. 각 역할에 대해, 그 역할이 해당 태스크에 왜 최적인지 상세히 설명하세요.\n"
                        "4. 그 역할이 효과적으로 태스크를 수행하기 위해 필요한 주요 스킬이나 속성을 3가지 들어주세요.\n\n"
                        "창의성을 발휘하여 태스크의 본질을 포착한 혁신적인 역할을 생성하세요."
                    ),
                ),
            ],
        )
        chain = prompt | self.llm
        tasks_with_roles = chain.invoke(
            {"tasks": "\n".join([task.description for task in tasks])}
        )
        return tasks_with_roles.tasks


class Executor:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm
        self.tools = [TavilySearchResults(max_results=3)]
        self.base_agent = create_react_agent(self.llm, self.tools)

    def run(self, task: Task) -> str:
        result = self.base_agent.invoke(
            {
                "messages": [
                    (
                        "system",
                        (
                            f"당신은 {task.role.name}입니다.\n"
                            f"설명: {task.role.description}\n"
                            f"주요 스킬: {', '.join(task.role.key_skills)}\n"
                            "당신의 역할에 기반하여 주어진 태스크를 최고의 능력으로 수행해 주세요."
                        ),
                    ),
                    (
                        "human",
                        f"다음 태스크를 실행해 주세요:\n\n{task.description}",
                    ),
                ]
            }
        )
        return result["messages"][-1].content


class Reporter:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm

    def run(self, query: str, results: list[str]) -> str:
        prompt = ChatPromptTemplate(
            [
                (
                    "system",
                    (
                        "당신은 종합적인 보고서 작성 전문가입니다. 여러 정보원의 결과를 통합하고, 통찰력 있는 포괄적인 보고서를 작성하는 능력이 있습니다."
                    ),
                ),
                (
                    "human",
                    (
                        "태스크: 다음 정보를 바탕으로 포괄적이고 일관성 있는 답변을 작성하세요.\n"
                        "요구사항:\n"
                        "1. 제공된 모든 정보를 통합하여 잘 구성된 답변을 만들어주세요.\n"
                        "2. 답변은 원래 쿼리에 직접 응답하는 형태로 작성하세요.\n"
                        "3. 각 정보의 중요 포인트나 발견 사항을 포함하세요.\n"
                        "4. 마지막에 결론이나 요약을 제공하세요.\n"
                        "5. 답변은 상세하면서도 간결하게 작성하고, 250~300단어 정도를 목표로 하세요.\n"
                        "6. 답변은 한국어로 작성하세요.\n\n"
                        "사용자 요청: {query}\n\n"
                        "수집한 정보:\n{results}"
                    ),
                ),
            ],
        )
        chain = prompt | self.llm | StrOutputParser()
        return chain.invoke(
            {
                "query": query,
                "results": "\n\n".join(
                    f"Info {i+1}:\n{result}" for i, result in enumerate(results)
                ),
            }
        )


class RoleBasedCooperation:
    def __init__(self, llm: ChatOpenAI):
        self.llm = llm
        self.planner = Planner(llm=llm)
        self.role_assigner = RoleAssigner(llm=llm)
        self.executor = Executor(llm=llm)
        self.reporter = Reporter(llm=llm)
        self.graph = self._create_graph()

    def _create_graph(self) -> StateGraph:
        workflow = StateGraph(AgentState)

        workflow.add_node("planner", self._plan_tasks)
        workflow.add_node("role_assigner", self._assign_roles)
        workflow.add_node("executor", self._execute_task)
        workflow.add_node("reporter", self._generate_report)

        workflow.set_entry_point("planner")

        workflow.add_edge("planner", "role_assigner")
        workflow.add_edge("role_assigner", "executor")
        workflow.add_conditional_edges(
            "executor",
            lambda state: state.current_task_index < len(state.tasks),
            {True: "executor", False: "reporter"},
        )

        workflow.add_edge("reporter", END)

        return workflow.compile()

    def _plan_tasks(self, state: AgentState) -> dict[str, Any]:
        tasks = self.planner.run(query=state.query)
        return {"tasks": tasks}

    def _assign_roles(self, state: AgentState) -> dict[str, Any]:
        tasks_with_roles = self.role_assigner.run(tasks=state.tasks)
        return {"tasks": tasks_with_roles}

    def _execute_task(self, state: AgentState) -> dict[str, Any]:
        current_task = state.tasks[state.current_task_index]
        result = self.executor.run(task=current_task)
        return {
            "results": [result],
            "current_task_index": state.current_task_index + 1,
        }

    def _generate_report(self, state: AgentState) -> dict[str, Any]:
        report = self.reporter.run(query=state.query, results=state.results)
        return {"final_report": report}

    def run(self, query: str) -> str:
        initial_state = AgentState(query=query)
        final_state = self.graph.invoke(initial_state, {"recursion_limit": 1000})
        return final_state["final_report"]


def main():
    import argparse

    from settings import Settings

    settings = Settings()
    parser = argparse.ArgumentParser(
        description="RoleBasedCooperation을 사용하여 태스크를 실행합니다"
    )
    parser.add_argument("--task", type=str, required=True, help="실행할 태스크")
    args = parser.parse_args()

    llm = ChatOpenAI(
        model=settings.openai_smart_model, temperature=settings.temperature
    )
    agent = RoleBasedCooperation(llm=llm)
    result = agent.run(query=args.task)
    print(result)


if __name__ == "__main__":
    main()
