import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore_async
from src.core.config import settings

service_json = {
    "type": "service_account",
    "project_id": "tds-pdfly",
    "private_key_id": settings.firebase_private_key_id,
    "private_key": settings.firebase_private_key.replace('\\n', '\n'),
    "client_email": settings.firebase_client_email,
    "client_id": settings.firebase_client_id,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": settings.firebase_client_x509_cert_url,
    "universe_domain": "googleapis.com"
}

try:
    cred = credentials.Certificate(service_json)
except Exception as e:
    raise e

app = firebase_admin.initialize_app(cred)

db = firestore_async.client()