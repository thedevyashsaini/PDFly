from uuid import UUID
from src.validations import ListRequest, Response
from src.models import PDF, User, Chat
from typing import List, Annotated
from fastapi import Form, File, UploadFile
from src.utils import chunker, store, summarize
from langchain_community.document_loaders import PyPDFLoader
import tempfile
from src.core.config import settings
from langchain_core.documents import Document

def listPDFs(body: ListRequest) -> Response:
    """
    Lists all PDFs associated with a user.

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
        
        pdfs: List[str] = PDF.get_by_user_id(body.user_id)
        return Response(success=True, message="PDFs listed", pdfs=pdfs)
    except Exception as e:
        return Response(success=False, message=str(e))
    
async def listChatPDFs(pdf_id: UUID, body: ListRequest) -> Response:
    """
    Lists all chats associated with a specific PDF for a user.

    Args:
        pdf_id (UUID): The unique identifier for the PDF.
        body (ListRequest): The request body containing the user ID.
            - user_id (UUID): The unique identifier for the user.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    try:
        user: User = User.get_by_id(body.user_id)
        
        if not user:
            raise Exception("User not found")
        
        pdf: PDF = PDF.get_by_id(pdf_id)
        if not pdf or pdf.user_id != user.id:
            raise Exception("PDF not found")
        
        chats: List[Chat] = Chat.get_by_pdf_id(pdf.id, user.id)
        
        return Response(success=True, message="Chats Listed", chats=chats)
    except Exception as e:
        return Response(success=False, message=f"Internal Server Error: {e}")
    

async def addPDF(user_id: Annotated[str, Form()], pdf: Annotated[UploadFile, File()]) -> Response:
    """
    Adds a new PDF for a user.

    Args:
        user_id (str): The unique identifier for the user.
        pdf (UploadFile): The PDF file to be uploaded.

    Returns:
        Response: A response object indicating success or failure and additional information.
    """
    try:
        user: User = User.get_by_id(user_id)
        
        if not user:
            raise Exception("User not found")
        
        if not pdf.filename.endswith(".pdf"):
            raise Exception("Invalid file type")
        
        if (pdf.size / (1024 * 1024)) > settings.max_pdf_size_mb:
            print(pdf.size)
            raise Exception("File too large")
        
        new_pdf = PDF.add(user_id, pdf.filename.replace(".pdf", ""))
        
        if new_pdf.id:
            
            pdf_data = pdf.file.read()
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf_file:
                temp_pdf_file.write(pdf_data)
                temp_pdf_path = temp_pdf_file.name
            
            loader = PyPDFLoader(temp_pdf_path)
            
            pdf_text = ""
            async for page in loader.alazy_load():
                pdf_text += page.page_content
                
            pdf_chunks: List[str] = chunker.split(pdf_text)
            
            documents: List[Document] = []
            ids: List[str] = []
            
            for chunk in pdf_chunks:
                documents.append(Document(
                    page_content=chunk,
                    metadata={"pdf": str(new_pdf.id)}
                ))
                
            for i in range(len(pdf_chunks)):
                ids.append(str(new_pdf.id) + "." + str(i))
                
            
            summary = summarize(loader)
            
            documents.append(Document(
                page_content=summary,
                metadata={"pdf": str(new_pdf.id)}
            ))
            
            ids.append(str(new_pdf.id) + ".summary")
            
            store.vector_store.add_documents(documents=documents, ids=ids)
            
            return Response(success=True, message="PDF added", pdf=new_pdf)
        
        return Response(success=False, message="Failed to add PDF")
        
    except Exception as e:
        return Response(success=False, message="Internal Server Error: "+str(e))