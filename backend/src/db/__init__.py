from src.db.firestore import db as firestore_client
from src.db.supabase import db as supabase_client

class Database:
    def __init__(self):
        self.firestore = firestore_client
        self.supabase = supabase_client

db = Database()

__all__ = ["db"]