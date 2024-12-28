from fastapi import APIRouter, Depends
router = APIRouter()

from src.validations import CreateUserRequest, ListRequest
from src.services.user_service import CreateUser, GetUser

@router.post("/new")
async def CreateUser(body: CreateUserRequest, service=Depends(CreateUser)):
    """
    Creates a new user.

    Args:
        body (CreateUserRequest): The request body containing user details.
            - id (str): The unique identifier for the user.
            - email (str): The email address of the user.
            - name (str): The name of the user.
            - pfp (str): The profile picture URL of the user.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    return service

@router.post("/")
async def getUser(body: ListRequest, service=Depends(GetUser)):
    """
    Retrieves a user by their unique identifier.

    Args:
        body (ListRequest): The request body containing the user ID.
            - user_id (UUID): The unique identifier for the user.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    return service