from backend.ingestion.vector_store import store
from backend.ingestion.splitter import split_text


def ingest_note(data):
    try:
        chunks = split_text(data)

        vector_store = store()

        vector_store.add_documents(chunks)

        return {
            "success": True,
            "message": "Note embeddings added to vector database successfully",
        }

    except Exception as e:
        print(f"Ingestion error: {e}")
        raise



def delete_note(noteId, userId):
    try:
        vector_store = store()

        where_filter = {
            "$and": [
                {"noteId": noteId},
                {"userId": userId},
            ]
        }

        

      

        vector_store.delete(where=where_filter)

        

       

        return {
            "success": True,
            "message": "Note embeddings deleted successfully",
        }

    except Exception as e:
        print(f"Deletion error: {e}")
        raise

def update_note(note,userId):
    try:
            vector_store = store()
    
            vector_store.delete(
                where={
                    "$and": [
                        {"noteId": note.noteId},
                        {"userId": userId},
                    ]
                }
            )

            ingest_note(note)
    
            return {
                "success": True,
                "message": "Note updated successfully",
            }
    
    except Exception as e:
            print(f"Update error: {e}")
            raise
    

        
