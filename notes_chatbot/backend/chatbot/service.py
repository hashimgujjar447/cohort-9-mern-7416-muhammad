from langchain_huggingface import HuggingFaceEmbeddings,HuggingFaceEndpoint,ChatHuggingFace
from backend.chatbot.prompt import template
from backend.chatbot.retriever import retrieve_data
from backend.chatbot.chain import format_chain

from langchain_core.messages import HumanMessage, AIMessage
from dotenv import load_dotenv


load_dotenv()



llm=HuggingFaceEndpoint(
    repo_id="openai/gpt-oss-120b",
    task="text-generation",
    temperature=0.2
)
model=ChatHuggingFace(
    llm=llm
)



def format_history(history):
    messages = []

    for message in history:
        if message.role == "user":
            messages.append(
                HumanMessage(content=message.content)
            )
        elif message.role == "assistant":
            messages.append(
                AIMessage(content=message.content)
            )

    return messages

def chat_bot(query: str, userId: str,history=None):
    if history is None:
        history = []

    retriever = retrieve_data(userId)

    chain = format_chain(
        model=model,
        template=template,
        retriever=retriever,
    )

    formatted_history=format_history(history)

    result=chain.invoke({
        "query": query,
        "history": formatted_history,
    })

    return result