from fastapi import APIRouter
from src.apis.pdf import router as pdfRouter

apis = APIRouter()
apis.include_router(pdfRouter)

__all__ = ["apis"]