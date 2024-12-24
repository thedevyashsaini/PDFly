import os
import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials
from firebase_admin import firestore_async

load_dotenv()

service_json = {
    "type": "service_account",
    "project_id": "tds-pdfly",
    "private_key_id": os.environ.get('FIREBASE_PRIVATE_KEY_ID'),
    "private_key": os.environ.get('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
    "client_email": os.environ.get('FIREBASE_CLIENT_EMAIL'),
    "client_id": os.environ.get('FIREBASE_CLIENT_ID'),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.environ.get('FIREBASE_CLIENT_X509_CERT_URL'),
    "universe_domain": "googleapis.com"
}

try:
    cred = credentials.Certificate(service_json)
except Exception as e:
    raise e

app = firebase_admin.initialize_app(cred)

db = firestore_async.client()