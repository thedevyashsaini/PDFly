# 3rd party imports
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import uvicorn
# local imports
from src.apis import apis
from src.core.config import settings


description = """
PDFly let's u talk to your PDFs with ease. 🚀
"""

app = FastAPI(
    title="PDFly",
    description=description,
    summary="Talk to your PDFs, they'll show u what's inside 🫦",
    version="1.0.1",
    contact={
        "name": "Devyash Saini",
        "url": "https://thedevyashsaini.github.io",
        "email": "dysaini2004@gmail.com",
    },
)

# Add GZip middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(apis, prefix="/api/v1")

@app.get("/")
async def read_root():
    return {
        "app_name": settings.app_name,
        "app_version": settings.app_version,
        "environment": settings.environment
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=False)
