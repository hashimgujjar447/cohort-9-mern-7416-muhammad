from fastapi import APIRouter

from backend.ingestion.service import (
    ingest_note,
    delete_note,
    update_note,
)

from backend.schema.ingestion import (
    NoteIngestionRequest,
    NoteDeleteRequest,
)


router = APIRouter(
    prefix="/api/v1/ingestion",
    tags=["Ingestion"],
)


@router.post("/note")
def ingest_note_route(data: NoteIngestionRequest):
    return ingest_note(data=data)

@router.delete("/note")
def delete_note_route(data: NoteDeleteRequest):

    return delete_note(
        noteId=data.noteId,
        userId=data.userId,
    )

@router.put("/note")
def update_note_route(
    data: NoteIngestionRequest,
):
    return update_note(
        note=data,
        userId=data.userId,
    )