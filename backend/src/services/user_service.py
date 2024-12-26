from src.validations import CreateUserRequest, ListRequest, Response
from src.models import User

def GetUser(body: ListRequest) -> Response:
    """
    Retrieves a user by their unique identifier.

    Args:
        body (ListRequest): The request body containing the user ID.
            - user_id (UUID): The unique identifier for the user.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    try:
        user = User.get_by_id(body.user_id)
        
        if not user:
            return Response(success=False, message="User not found")
        
        return Response(success=True, message="User found", user=user)
    
    except Exception as e:
        return Response(success=False, message=f"Error: {str(e)}")

def CreateUser(body: CreateUserRequest) -> Response:
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
    try:
        user = User.get_by_email(body.email)
        
        if user: 
            return Response(success=False, message="User already exists")
        
        user = User.add(body.id, body.email, body.name, body.pfp)
        
        if not user:
            raise Exception("User not created")
        
        return Response(success=True, message="User created", user=user)
    
    except Exception as e:
        return Response(success=False, message=f"Error: {str(e)}")