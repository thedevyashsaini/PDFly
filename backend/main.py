# 3rd party imports
from fastapi.middleware.gzip import GZipMiddleware
from fastapi import FastAPI
import uvicorn
# local imports
from src.apis import apis

app = FastAPI()
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.include_router(apis, prefix="/api/v1")

@app.get("/")
async def read_root():
    return {"version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)