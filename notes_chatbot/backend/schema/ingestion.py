from datetime import datetime

from pydantic import BaseModel,Field


class NoteIngestionRequest(BaseModel):
    noteId: str
    userId: str
    title: str
    content: str
    createdAt: datetime
    updatedAt: datetime
    
class NoteDeleteRequest(BaseModel):
    noteId: str
    userId: str    