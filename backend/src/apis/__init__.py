from fastapi import APIRouter
from src.apis.pdf import router as pdfRouter
from src.apis.chat import router as chatRouter
from src.apis.user import router as userRouter

apis = APIRouter()
apis.include_router(pdfRouter, prefix="/pdf")
apis.include_router(chatRouter, prefix="/chat")
apis.include_router(userRouter, prefix="/user")

__all__ = ["apis"]
