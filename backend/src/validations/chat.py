from uuid import UUID
from pydantic import BaseModel
from typing import List

class CreateChatRequest(BaseModel):
    """
    A class to represent a request to create a chat.

    Attributes:
        user_id (UUID): The unique identifier for the user.
        pdfs (List[UUID]): List of PDF document IDs associated with the chat.
    """
    user_id: UUID
    pdfs: List[UUID]
    name: str

class RespondRequest(BaseModel):
    """
    A class to represent a request to respond to a chat.

    Attributes:
        user_id (UUID): The unique identifier for the user.
        chat_id (UUID): The unique identifier for the chat.
        message (str): The message content to be sent in the chat.
    """
    user_id: UUID
    chat_id: UUID
    message: str
    
class AddPDFRequest(BaseModel):
    """
    AddPDFRequest is a data model for adding a PDF to a chat.

    Attributes:
        user_id (UUID): The unique identifier of the user.
        chat_id (UUID): The unique identifier of the chat.
        pdf_id (UUID): The unique identifier of the PDF.
    """
    user_id: UUID
    chat_id: UUID
    pdf_id: UUID