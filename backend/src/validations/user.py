from pydantic import BaseModel

class CreateUserRequest(BaseModel):
    """
    A class to represent a request to create a user.

    Attributes:
        id (str): The unique identifier for the user.
        email (str): The email address of the user.
        name (str): The name of the user.
        pfp (str): The profile picture URL of the user.
    """
    id: str
    email: str
    name: str
    pfp: str