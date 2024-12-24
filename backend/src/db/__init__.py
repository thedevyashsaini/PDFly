from db.firestore import db as firestore_client
from db.supabase import db as supabase_client

class Database:
    def __init__(self):
        self.__firestore = firestore_client
        self.__supabase = supabase_client
    
    def firestore(self):
        return self.__firestore
    
    def supabase(self):
        return self.__supabase

db = Database()

__all__ = ["db"]