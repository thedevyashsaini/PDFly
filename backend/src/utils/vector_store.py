from pinecone import Pinecone, ServerlessSpec
from src.core.config import settings
import time
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings

class Store:
    """
    A class to manage the vector store using Pinecone and HuggingFace embeddings.

    Attributes:
        _pinecone (Pinecone): Pinecone client instance.
        index (Pinecone.Index): Pinecone index instance.
        embeddings (HuggingFaceEmbeddings): HuggingFace embeddings instance.
        vector_store (PineconeVectorStore): Vector store instance.
    """

    def __init__(self):
        """
        Initializes the Store class, creates a Pinecone index if it doesn't exist,
        and sets up the vector store with HuggingFace embeddings.
        """
        self._pinecone = Pinecone(api_key=settings.pinecone_api_key)
        index_name = settings.app_name.lower().replace(" ", "_")
        
        existing_indexes = [index_info["name"] for index_info in self._pinecone.list_indexes()]

        if index_name not in existing_indexes:
            self._pinecone.create_index(
                name=index_name,
                dimension=768,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            )
            while not self._pinecone.describe_index(index_name).status["ready"]:
                time.sleep(1)
                
        self.index = self._pinecone.Index(index_name)
        
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

        self.vector_store = PineconeVectorStore(index=self.index, embedding=self.embeddings)

store = Store()