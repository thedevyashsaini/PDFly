from typing import List
from uuid import UUID
from src.utils import store, llm
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain import hub

def responder(pdf_ids: List[UUID], msg: str) -> any:
    """
    Responds to a message by querying chunks related to the provided PDF IDs.

    Args:
        pdf_ids (List[UUID]): List of PDF IDs to query.
        msg (str): User's message.

    Returns:
        str: Combined response for all PDF IDs.
    """
    
    vector_store = store.vector_store

    retriever = vector_store.as_retriever(
        search_kwargs={
            "filter": {"pdf": {"$in":[f"{pdf_id}" for pdf_id in pdf_ids]}},
            "k": 5
        }
    )
    
    retrieval_qa_chat_prompt = hub.pull("langchain-ai/retrieval-qa-chat")
    combine_docs_chain = create_stuff_documents_chain(
        llm, retrieval_qa_chat_prompt
    )
    
    retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)

    response = retrieval_chain.invoke({"input": msg})
    
    return response
