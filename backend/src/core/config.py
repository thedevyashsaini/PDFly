from pydantic_settings  import BaseSettings

class Settings(BaseSettings):
    # General App Config
    app_name: str = "PDFly"
    app_version: str = "1.0.0"
    environment: str = "development"
    cors_allowed_origins: str

    # Firestore Config
    firebase_private_key_id: str
    firebase_private_key: str
    firebase_client_email: str
    firebase_client_id: str
    firebase_client_x509_cert_url: str

    # Supabase Config
    supabase_url: str
    supabase_key: str

    # Pinecone Config
    pinecone_api_key: str

    # LangChain Config
    langchain_tracing_v2: bool = True
    langchain_endpoint: str
    langchain_api_key: str
    langchain_project: str = "PDFly"

    # TogatherAI Config
    togatherai_api_key: str

    # PDF Processing
    max_pdf_size_mb: int = 20
    max_chunk_size: int = 500
    chunk_overlap: int = 100

    # Server Config
    host: str 
    port: int

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Instantiate settings
settings = Settings()
