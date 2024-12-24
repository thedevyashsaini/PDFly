from fastapi import APIRouter
router = APIRouter()

@router.get("/pdf/create", tags=["pdfs"])
async def create_pdf():
    return "test sin"