from langchain_chroma import Chroma

from backend.ingestion.embeddings import embedding_function


def store():
    return Chroma(
        collection_name="user_notes",
        embedding_function=embedding_function,
        persist_directory="data/chroma"
    )