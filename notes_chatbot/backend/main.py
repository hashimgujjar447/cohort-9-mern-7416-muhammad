from fastapi import FastAPI

from backend.api.routes.ingestion import router as ingestion_router
from backend.api.routes.chatbot import router as chatbot_router


app = FastAPI()


app.include_router(ingestion_router)
app.include_router(chatbot_router)


@app.get("/health")
def health():
    return {"status": "ok"}