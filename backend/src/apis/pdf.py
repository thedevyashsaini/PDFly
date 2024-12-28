from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Form, Depends, File, UploadFile
router = APIRouter()

from src.validations import ListRequest
from src.services.pdf_service import listPDFs, addPDF, listChatPDFs

@router.post("/")
async def list(body: ListRequest, service=Depends(listPDFs)):
    """
    Lists all PDFs associated with a user.

    Args:
        body (ListRequest): The request body containing the user ID.
            - user_id (UUID): The unique identifier for the user.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    return service

@router.post("/add")
async def add(user_id: Annotated[str, Form()], pdf: Annotated[UploadFile, File()], service=Depends(addPDF)):
    """
    Adds a new PDF for a user.

    Args:
        user_id (str): The unique identifier for the user.
        pdf (UploadFile): The PDF file to be uploaded.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    return service

@router.post("/{pdf_id}/chats")
async def list_chats(pdf_id: UUID, body: ListRequest, service=Depends(listChatPDFs)):
    """
    Lists all chats associated with a specific PDF for a user.

    Args:
        pdf_id (UUID): The unique identifier for the PDF.
        body (ListRequest): The request body containing the user ID.
            - user_id (UUID): The unique identifier for the user.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    return service