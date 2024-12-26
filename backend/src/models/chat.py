from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from src.db import db

supabase = db.supabase

class Chat(BaseModel):
    id: UUID
    user_id: UUID
    pdfs: List[UUID]

    @staticmethod
    def get_by_id(chat_id: UUID) -> Optional["Chat"]:
        """
        Retrieves a chat by its unique identifier.

        Args:
            chat_id (UUID): The unique identifier for the chat.

        Returns:
            Optional[Chat]: The chat object if found, otherwise None.
        """
        response = supabase.from_("chats").select("*").eq("id", chat_id).execute()
        if len(response.data) > 0:
            return Chat(**response.data[0])
        return None

    @staticmethod
    def get_by_user_id(user_id: UUID) -> List["Chat"]:
        """
        Retrieves all chats associated with a user.

        Args:
            user_id (UUID): The unique identifier for the user.

        Returns:
            List[Chat]: A list of chat objects associated with the user.
        """
        response = supabase.from_("chats").select("*").eq("user_id", user_id).execute()
        return [Chat(**chat) for chat in response.data or []]
    
    @staticmethod
    def get_by_pdf_id(pdf: UUID, user_id: UUID) -> List["Chat"]:
        """
        Retrieves all chats associated with a specific PDF for a user.

        Args:
            pdf (UUID): The unique identifier for the PDF.
            user_id (UUID): The unique identifier for the user.

        Returns:
            List[Chat]: A list of chat objects associated with the PDF and user.
        """
        response = supabase.from_("chats").select("*").eq("user_id", user_id).execute()
        if len(response.data) < 0:
            return []
        
        all_chats = response.data
        
        chats: List[Chat] = []
        for chat in all_chats:
            for pdf_id in chat["pdfs"]:
                if pdf_id == str(pdf):
                    chats.append(Chat(**chat))
                    break
                
        return chats

    @staticmethod
    def add(user_id: UUID, pdf_ids: List[UUID]) -> "Chat":
        """
        Adds a new chat to the database.

        Args:
            user_id (UUID): The unique identifier for the user.
            pdf_ids (List[UUID]): List of PDF document IDs associated with the chat.

        Returns:
            Chat: The newly created chat object.

        Raises:
            Exception: If the chat could not be added.
        """
        chat_data = {
            "user_id": str(user_id),
            "pdfs": [str(pdf_id) for pdf_id in pdf_ids],
        }
        response = supabase.from_("chats").insert(chat_data).execute()
        if len(response.data) > 0:
            return Chat(**response.data[0])
        raise Exception(f"Failed to add chat: {response.status_code}, {response.json()}")

    @staticmethod
    def delete(chat_id: UUID) -> bool:
        """
        Deletes a chat from the database.

        Args:
            chat_id (UUID): The unique identifier for the chat.

        Returns:
            bool: True if the deletion was successful, otherwise False.
        """
        response = supabase.from_("chats").delete().eq("id", chat_id).execute()
        return response.status_code == 204