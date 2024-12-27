from typing import List
from uuid import UUID
from src.models import Chat, User, PDF, Message
from src.validations import Response, ListRequest, CreateChatRequest, RespondRequest, AddPDFRequest
from src.utils import responder

def listChats(body: ListRequest) -> Response:
    """
    Lists all chats associated with a user.

    Args:
        body (ListRequest): The request body containing the user ID.
            - user_id (UUID): The unique identifier for the user.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    try:
        user: User = User.get_by_id(body.user_id)
        
        if not user:
            raise Exception("User not found")
        
        chats: List[str] = Chat.get_by_user_id(body.user_id)
        return Response(success=True, message="Chats listed", chats=chats)
    except Exception as e:
        return Response(success=False, message="Internal Server Error: "+str(e))
    
def listChatMessages(chat_id: UUID, body: ListRequest) -> Response:
    """
    Lists all messages associated with a specific chat for a user.

    Args:
        chat_id (UUID): The unique identifier for the chat.
        body (ListRequest): The request body containing the user ID.
            - user_id (UUID): The unique identifier for the user.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    try:
        user: User = User.get_by_id(body.user_id)
        
        if not user:
            raise Exception("User not found")
        
        chat: Chat = Chat.get_by_id(chat_id)
        
        if not chat or chat.user_id != user.id:
            raise Exception("Chat not found")
        
        messages: List[Message] = Message.get_by_chat_id(chat_id)
        
        return Response(success=True, message="Messages listed", messages=messages)
        
    except Exception as e:
        return Response(success=False, message=f"Internal Server Error: {str(e)}")
    
def createChat(body: CreateChatRequest) -> Response:
    """
    Creates a new chat.

    Args:
        body (CreateChatRequest): The request body containing chat details.
            - user_id (UUID): The unique identifier for the user.
            - pdfs (List[UUID]): List of PDF document IDs associated with the chat.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    try: 
        user: User = User.get_by_id(body.user_id)
        
        if not user:
            raise Exception("User not found")
        
        for pdf_id in body.pdfs:
            pdf: PDF = PDF.get_by_id(pdf_id)
            if not pdf:
                raise Exception(f"PDF not found - {pdf_id}")
            
        new_chat = Chat.add(body.user_id, body.pdfs)
        return Response(success=True, message="Chat created", chat=new_chat)
    except Exception as e:
        return Response(success=False, message=f"Internal Server Error: {str(e)}")
    
def respond(body: RespondRequest) -> Response:
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
    try:
        user: User = User.get_by_id(body.user_id)
        
        if not user:
            raise Exception("User not found")
        
        chat: Chat = Chat.get_by_id(body.chat_id)
        
        if not chat or chat.user_id != user.id:
            raise Exception("Chat not found")
        
        message: Message = Message.add(body.chat_id, body.message)
        
        if not message:
            raise Exception("Failed to add message")
        
        generation = responder(chat.pdfs, message.raw)
        
        if not generation or not generation["answer"]:
            raise Exception("Failed to respond")
        
        answer = generation["answer"]
        
        references: List[str] = [str(context.id) for context in generation["context"]]
        
        response: Message = Message.add(body.chat_id, answer, is_generated=True, references=references)
        
        if not response:
            raise Exception("Failed to add response")
        
        return Response(success=True, message="Response generated", response=response)
    
    except Exception as e:
        return Response(success=False, message=f"Internal Server Error: {str(e)}")
    
    
def addPDF(body: AddPDFRequest) -> Response: 
    """
    Adds a PDF to a chat for a given user.
    
    Args:
        body (AddPDFRequest): The request body containing user_id, chat_id, and pdf_id.
        
    Returns:
        Response: A response object indicating success or failure of the operation.
    """
    try:
        user: User = User.get_by_id(body.user_id)
        
        if not user:
            raise Exception("User not found")
        
        chat: Chat = Chat.get_by_id(body.chat_id)
        
        if not chat or chat.user_id != user.id:
            raise Exception("Chat not found")
        
        if body.pdf_id in chat.pdfs:
            raise Exception("PDF already in chat")
        
        pdf: PDF = PDF.get_by_id(body.pdf_id)
        
        if not pdf or pdf.user_id != user.id:
            raise Exception("PDF not found")
        
        chat.pdfs.append(body.pdf_id)
        
        resp = chat.update()
        
        if not resp:
            raise Exception("Failed to add PDF to chat")
        
        return Response(success=True, message="PDF added to chat", chat=chat)
    
    except Exception as e:
        return Response(success=False, message=f"Internal Server Error: {str(e)}")
        