from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Optional
from src.db import db

supabase = db.supabase

class User(BaseModel):
    id: UUID
    email: EmailStr
    name: str
    pfp: str

    @staticmethod
    def get_by_id(user_id: UUID) -> Optional["User"]:
        """
        Retrieves a user by their unique identifier.

        Args:
            user_id (UUID): The unique identifier for the user.

        Returns:
            Optional[User]: The user object if found, otherwise None.
        """
        response = supabase.from_("users").select("*").eq("id", user_id).execute()
        if len(response.data) > 0:
            return User(**response.data[0])
        return None

    @staticmethod
    def get_by_email(email: str) -> Optional["User"]:
        """
        Retrieves a user by their email address.

        Args:
            email (str): The email address of the user.

        Returns:
            Optional[User]: The user object if found, otherwise None.
        """
        response = supabase.from_("users").select("*").eq("email", email).execute()
        if len(response.data) > 0:
            return User(**response.data[0])
        return None

    @staticmethod
    def add(id: UUID, email: str, name: str, pfp: str) -> "User":
        """
        Adds a new user to the database.

        Args:
            id (UUID): The unique identifier for the user.
            email (str): The email address of the user.
            name (str): The name of the user.
            pfp (str): The profile picture URL of the user.

        Returns:
            User: The newly created user object.

        Raises:
            Exception: If the user could not be added.
        """
        user_data = {
            "id": str(id),
            "email": email,
            "name": name,
            "pfp": pfp,
        }
        response = supabase.from_("users").insert(user_data).execute()
        if len(response.data) > 0:
            return User(**response.data[0])
        raise Exception(f"Failed to add user: {response.status_code}, {response.json()}")

    @staticmethod
    def update_pfp(user_id: UUID, new_pfp: str) -> bool:
        """
        Updates the profile picture of a user.

        Args:
            user_id (UUID): The unique identifier for the user.
            new_pfp (str): The new profile picture URL.

        Returns:
            bool: True if the update was successful, otherwise False.
        """
        response = supabase.from_("users").update({"pfp": new_pfp}).eq("id", user_id).execute()
        return response.data

    @staticmethod
    def delete(user_id: UUID) -> bool:
        """
        Deletes a user from the database.

        Args:
            user_id (UUID): The unique identifier for the user.

        Returns:
            bool: True if the deletion was successful, otherwise False.
        """
        response = supabase.from_("users").delete().eq("id", user_id).execute()
        return response.data