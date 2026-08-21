from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


def split_text(data):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        separators=[
            "\n\n",
            "\n",
            " ",
            "",
        ],
    )

    document = Document(
        page_content=f"""
Title: {data.title}

Content: {data.content}
""",
        metadata={
            "title": data.title,
            "createdAt": data.createdAt.isoformat(),
            "updatedAt": data.updatedAt.isoformat(),
            "userId": data.userId,
            "noteId": data.noteId,
        },
    )

    chunks = text_splitter.split_documents([document])

    return chunks