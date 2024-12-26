from uuid import UUID
from pydantic import BaseModel
from src.validations.chat import CreateChatRequest, RespondRequest
from src.validations.user import CreateUserRequest

class Response(BaseModel):
    """
    A class to represent a generic response.

    Attributes:
        success (bool): Indicates if the operation was successful.
        message (str): A message providing additional information about the response.
    """
    success: bool
    message: str

    class Config:
        extra = 'allow'
        
class ListRequest(BaseModel):
    """
    A class to represent a request to list items.

    Attributes:
        user_id (UUID): The unique identifier for the user.
    """
    user_id: UUID

__all__ = [Response, ListRequest, CreateChatRequest, RespondRequest, CreateUserRequest]