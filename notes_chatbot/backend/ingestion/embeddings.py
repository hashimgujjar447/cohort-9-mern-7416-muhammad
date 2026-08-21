from langchain_huggingface import HuggingFaceEmbeddings


embedding_function = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)