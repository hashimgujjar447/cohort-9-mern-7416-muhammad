from backend.ingestion.vector_store import store


def retrieve_data(user_id:str):
    vector_store=store()

    retriever=vector_store.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k":4,
            "filter":{
                "userId":user_id
            }
        }
    )

    

    return  retriever
