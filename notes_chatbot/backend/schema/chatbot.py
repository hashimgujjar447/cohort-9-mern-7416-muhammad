from pydantic import BaseModel
from typing import Literal


class ChatMessageHistory(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    query: str
    userId: str
    history: list[ChatMessageHistory] = []