from langchain.text_splitter import CharacterTextSplitter
from src.core.config import settings

class Chunker:
    """
    A class to handle text chunking using the CharacterTextSplitter.

    Attributes:
        max_chunk_size (int): Maximum size of each chunk.
        chunk_overlap (int): Overlap size between chunks.
        text_splitter (CharacterTextSplitter): Instance of CharacterTextSplitter for splitting text.
    """

    def __init__(self):
        """
        Initializes the Chunker class with settings for chunk size and overlap.
        """
        self.max_chunk_size = settings.max_chunk_size
        self.chunk_overlap = settings.chunk_overlap
        self.text_splitter = CharacterTextSplitter(
            separator="\n\n",
            chunk_size=self.max_chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            is_separator_regex=False,
        )

    def split(self, text_stream: str):
        """
        Splits the input text stream into chunks.

        Args:
            text_stream (str): The text to be split into chunks.

        Returns:
            List[str]: List of text chunks.
        """
        return self.text_splitter.split_text(text_stream)

chunker = Chunker()