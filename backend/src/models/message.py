from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from src.db import db

supabase = db.supabase

class Message(BaseModel):
    id: UUID
    chat_id: UUID
    is_generated: bool = False
    timestamp: datetime
    raw: str
    references: Optional[List[str]]

    @staticmethod
    def get_by_id(message_id: UUID) -> Optional["Message"]:
        """
        Retrieves a message by its unique identifier.

        Args:
            message_id (UUID): The unique identifier for the message.

        Returns:
            Optional[Message]: The message object if found, otherwise None.
        """
        response = supabase.from_("messages").select("*").eq("id", message_id).single().execute()
        if response.data:
            return Message(**response.data)
        return None

    @staticmethod
    def get_by_chat_id(chat_id: UUID) -> List["Message"]:
        """
        Retrieves all messages associated with a specific chat.

        Args:
            chat_id (UUID): The unique identifier for the chat.

        Returns:
            List[Message]: A list of message objects associated with the chat.
        """
        response = supabase.from_("messages").select("*").eq("chat_id", chat_id).execute()
        return [Message(**message) for message in (response.data or [])]

    @staticmethod
    def add(chat_id: UUID, raw: str, is_generated: bool = False, references: Optional[List[str]] = None) -> "Message":
        """
        Adds a new message to the database.

        Args:
            chat_id (UUID): The unique identifier for the chat.
            raw (str): The raw message content.
            is_generated (bool, optional): Indicates if the message is generated. Defaults to False.
            references (Optional[List[str]], optional): List of references associated with the message. Defaults to None.

        Returns:
            Message: The newly created message object.

        Raises:
            Exception: If the message could not be added.
        """
        message_data = {
            "chat_id": str(chat_id),
            "is_generated": is_generated,
            "references": references,
            "raw": raw
        }
        response = supabase.from_("messages").insert(message_data).execute()
        if len(response.data) > 0:
            return Message(**response.data[0])
        raise Exception(f"Failed to add message: {response.status_code}, {response.json()}")

    @staticmethod
    def delete(message_id: UUID) -> bool:
        """
        Deletes a message from the database.

        Args:
            message_id (UUID): The unique identifier for the message.

        Returns:
            bool: True if the deletion was successful, otherwise False.
        """
        response = supabase.from_("messages").delete().eq("id", message_id).execute()
        return response.status_code == 204