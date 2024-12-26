from langchain_openai import ChatOpenAI
from src.core.config import settings

"""
Initializes the ChatOpenAI instance for language model interactions.

Attributes:
    llm (ChatOpenAI): Instance of the ChatOpenAI class configured with the specified base URL, API key, and model.
"""

llm = ChatOpenAI(
    base_url="https://api.together.xyz/v1",
    api_key=settings.togatherai_api_key,
    model="mistralai/Mixtral-8x7B-Instruct-v0.1",
)