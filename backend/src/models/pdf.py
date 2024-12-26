from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from src.db import db 
from typing import List, Optional

supabase = db.supabase

class PDF(BaseModel):
    id: UUID
    user_id: UUID
    uploaded: datetime
    name: str

    @staticmethod
    def get_by_id(pdf_id: UUID) -> Optional["PDF"]:
        """
        Retrieves a PDF by its unique identifier.

        Args:
            pdf_id (UUID): The unique identifier for the PDF.

        Returns:
            Optional[PDF]: The PDF object if found, otherwise None.
        """
        response = supabase.from_("pdfs").select("*").eq("id", pdf_id).single().execute()
        if response.data:
            return PDF(**response.data)
        return None

    @staticmethod
    def get_by_user_id(user_id: UUID) -> List["PDF"]:
        """
        Retrieves all PDFs associated with a user.

        Args:
            user_id (UUID): The unique identifier for the user.

        Returns:
            List[PDF]: A list of PDF objects associated with the user.
        """
        response = supabase.from_("pdfs").select("*").eq("user_id", user_id).execute()
        return [PDF(**pdf) for pdf in response.data or []]

    @staticmethod
    def add(user_id: UUID, name: str) -> "PDF":
        """
        Adds a new PDF to the database.

        Args:
            user_id (UUID): The unique identifier for the user.
            name (str): The name of the PDF.

        Returns:
            PDF: The newly created PDF object.

        Raises:
            Exception: If the PDF could not be added.
        """
        pdf_data = {"user_id": user_id, "name": name}
        response = supabase.from_("pdfs").insert(pdf_data).execute()
        if response.data[0]["id"]:
            return PDF(**response.data[0])
        raise Exception(f"Failed to add PDF: {response.status_code}, {response.json()}")