from fastapi import APIRouter

from backend.chatbot.service import chat_bot
from backend.schema.chatbot import ChatRequest


router = APIRouter(
    prefix="/api/v1/chat",
    tags=["Chatbot"],
)


@router.post("/")
def chat_route(data: ChatRequest):
    return {
        "success": True,
       "response": chat_bot(
            query=data.query,
            userId=data.userId,
            history=data.history,
        )
    }