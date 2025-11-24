import json
import os
import uuid
from typing import Optional

import faiss
import numpy as np
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import OpenAIEmbeddings
from pydantic import BaseModel, Field
from retry import retry
from settings import Settings

settings = Settings()


class ReflectionJudgment(BaseModel):
    needs_retry: bool = Field(
        description="태스크 실행 결과가 적절했다고 생각하십니까? 당신의 판단을 진윗값으로 표시하세요."
    )
    confidence: float = Field(
        description="당신의 판단에 대한 자신감 정도를 0부터 1까지의 소수로 표시하세요."
    )
    reasons: list[str] = Field(
        description="태스크 실행 결과의 적절성과 그에 대한 자신감에 대해 판단에 이른 이유를 간결하게 나열하세요."
    )


class Reflection(BaseModel):
    id: str = Field(description="리플렉션 내용에 고유성을 부여하기 위한 ID")
    task: str = Field(description="사용자로부터 주어진 태스크의 내용")
    reflection: str = Field(
        description="이 태스크에 대한 접근 시 당신의 사고 과정을 되돌아보세요. 개선할 수 있는 부분이 있었습니까? 다음에 유사한 태스크를 수행할 때, 더 나은 결과를 내기 위한 교훈을 2~3문장 정도로 간결하게 서술하세요."
    )
    judgment: ReflectionJudgment = Field(description="재시도가 필요한지에 대한 판정")


class ReflectionManager:
    def __init__(self, file_path: str = settings.default_reflection_db_path):
        self.file_path = file_path
        self.embeddings = OpenAIEmbeddings(model=settings.openai_embedding_model)
        self.reflections: dict[str, Reflection] = {}
        self.embeddings_dict: dict[str, list[float]] = {}
        self.index = None
        self.load_reflections()

    def load_reflections(self):
        if os.path.exists(self.file_path):
            with open(self.file_path, "r") as file:
                data = json.load(file)
                for item in data:
                    reflection = Reflection(**item["reflection"])
                    self.reflections[reflection.id] = reflection
                    self.embeddings_dict[reflection.id] = item["embedding"]

            if self.reflections:
                embeddings = list(self.embeddings_dict.values())
                self.index = faiss.IndexFlatL2(len(embeddings[0]))
                self.index.add(np.array(embeddings).astype("float32"))

    def save_reflection(self, reflection: Reflection) -> str:
        reflection.id = str(uuid.uuid4())
        reflection_id = reflection.id
        self.reflections[reflection_id] = reflection
        embedding = self.embeddings.embed_query(reflection.reflection)
        self.embeddings_dict[reflection_id] = embedding

        if self.index is None:
            self.index = faiss.IndexFlatL2(len(embedding))
        self.index.add(np.array([embedding]).astype("float32"))

        with open(self.file_path, "w", encoding="utf-8") as file:
            json.dump(
                [
                    {"reflection": reflection.dict(), "embedding": embedding}
                    for reflection, embedding in zip(
                        self.reflections.values(), self.embeddings_dict.values()
                    )
                ],
                file,
                ensure_ascii=False,
                indent=4,
            )

        return reflection_id

    def get_reflection(self, reflection_id: str) -> Optional[Reflection]:
        return self.reflections.get(reflection_id)

    def get_relevant_reflections(self, query: str, k: int = 3) -> list[Reflection]:
        if not self.reflections or self.index is None:
            return []

        query_embedding = self.embeddings.embed_query(query)
        try:
            D, I = self.index.search(
                np.array([query_embedding]).astype("float32"),
                min(k, len(self.reflections)),
            )
            reflection_ids = list(self.reflections.keys())
            return [
                self.reflections[reflection_ids[i]]
                for i in I[0]
                if i < len(reflection_ids)
            ]
        except Exception as e:
            print(f"Error during reflection search: {e}")
            return []


class TaskReflector:
    def __init__(self, llm: BaseChatModel, reflection_manager: ReflectionManager):
        self.llm = llm.with_structured_output(Reflection)
        self.reflection_manager = reflection_manager

    def run(self, task: str, result: str) -> Reflection:
        prompt = ChatPromptTemplate.from_template(
            "주어진 태스크 내용:\n{task}\n\n"
            "태스크 실행 결과:\n{result}\n\n"
            "당신은 고도의 추론 능력을 가진 AI 에이전트입니다. 위 태스크를 실행한 결과를 분석하고, 이 태스크에 대한 당신의 접근이 적절했는지 반성하세요.\n"
            "아래 항목에 따라 리플렉션 내용을 출력하세요.\n\n"
            "리플렉션:\n"
            "이 태스크에 대한 접근 시 당신의 사고 프로세스나 방법을 되돌아보세요. 개선할 수 있는 부분이 있었습니까?\n"
            "다음에 유사한 태스크를 수행할 때, 더 나은 결과를 내기 위한 교훈을 2~3문장 정도로 간결하게 서술하세요.\n\n"
            "판정:\n"
            "- 결과의 적절성: 태스크 실행 결과가 적절했다고 생각하십니까? 당신의 판단을 진윗값으로 표시하세요.\n"
            "- 판정의 자신감: 위 판단에 대한 당신의 자신감 정도를 0부터 1까지의 소수로 표시하세요.\n"
            "- 판정의 이유: 태스크 실행 결과의 적절성과 그에 대한 자신감에 대해 판단에 이른 이유를 간결하게 나열하세요.\n\n"
            "반드시 한국어로 출력하세요.\n\n"
            "Tips: Make sure to answer in the correct format."
        )

        chain = prompt | self.llm

        @retry(tries=5)
        def invoke_chain() -> Reflection:
            return chain.invoke({"task": task, "result": result})

        reflection = invoke_chain()
        reflection_id = self.reflection_manager.save_reflection(reflection)
        reflection.id = reflection_id

        return reflection
