from pydantic import BaseModel, Field
from typing import Literal


class ChatMessageHistory(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=4000)


class ChatRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    userId: str
    history: list[ChatMessageHistory] = Field(default=[], max_length=20)