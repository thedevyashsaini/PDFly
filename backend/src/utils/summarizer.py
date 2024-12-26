from langchain.chains.summarize import load_summarize_chain
from langchain_community.document_loaders import PyPDFLoader

from src.utils.llm import llm

def summarize(loader: PyPDFLoader) -> str:
    """
    Summarizes the content of a PDF document.

    Args:
        loader (PyPDFLoader): Loader to load and split the PDF document.

    Returns:
        str: Summary of the PDF document.
    """

    docs = loader.load_and_split()
    
    chain = load_summarize_chain(llm, chain_type="map_reduce")

    result = chain.run(docs)

    return result