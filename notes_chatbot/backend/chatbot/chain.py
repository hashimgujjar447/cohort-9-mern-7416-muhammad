from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser


def format_context(documents):
    context = "\n\n".join(
        f"Title: {doc.metadata.get('title', 'Unknown')}\n"
        f"Content: {doc.page_content}"
        for doc in documents
    )

    return context


def format_chain(model, template, retriever):
    parser = StrOutputParser()

    parallel_chain = RunnableParallel(
        {
            "context": (
                RunnablePassthrough()
                | (lambda x: x["query"])
                | retriever
                | format_context
            ),
            "query": lambda x: x["query"],
            "history": lambda x: x["history"],
        }
    )

    final_chain = parallel_chain | template | model | parser

    return final_chain