from uuid import UUID
from fastapi import APIRouter, Depends
router = APIRouter()

from src.validations import ListRequest, CreateChatRequest, RespondRequest, AddPDFRequest
from src.services.chat_service import listChats, createChat, listChatMessages, respond, addPDF, getChat

@router.post("/")
async def list(body: ListRequest, service=Depends(listChats)):
    """
    Lists all chats associated with a user.

    Args:
        body (ListRequest): The request body containing the user ID.
            - user_id (UUID): The unique identifier for the user.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    return service

@router.post("/get/{chat_id}")
async def messages(chat_id: UUID, body: ListRequest, service=Depends(getChat)):
    return service

@router.post("/messages/{chat_id}")
async def messages(chat_id: UUID, body: ListRequest, service=Depends(listChatMessages)):
    """
    Lists all messages associated with a specific chat for a user.

    Args:
        chat_id (UUID): The unique identifier for the chat.
        body (ListRequest): The request body containing the user ID.
            - user_id (UUID): The unique identifier for the user.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    return service

@router.post("/new")
async def create(body: CreateChatRequest, service=Depends(createChat)):
    """
    Creates a new chat.

    Args:
        body (CreateChatRequest): The request body containing chat details.
            - user_id (UUID): The unique identifier for the user.
            - pdfs (List[UUID]): List of PDF document IDs associated with the chat.
            - name (str): Name of the chat

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    return service

@router.post("/new/pdf")
async def addNewPDF(body: AddPDFRequest, service=Depends(addPDF)):
    """
    Endpoint to add a new PDF.

    Args:
        body (AddPDFRequest): The request body containing:
            - user_id (UUID): The unique identifier for the user.
            - chat_id (UUID): The unique identifier for the chat.
            - pdf_id (UUID): The unique identifier for the PDF to be added.

    Returns:
        The result of the addPDF service.
    """
    return service

@router.post("/new/message")
async def respond(body: RespondRequest, service=Depends(respond)):
    """
    Responds to a message in a chat.

    Args:
        body (RespondRequest): The request body containing response details.
            - user_id (UUID): The unique identifier for the user.
            - chat_id (UUID): The unique identifier for the chat.
            - message (str): The message content to be sent in the chat.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    return service