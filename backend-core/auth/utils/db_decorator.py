from functools import wraps
from config.database import SessionLocal

def with_db(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        db = SessionLocal()
        try:
            return f(db, *args, **kwargs)
        finally:
            db.close()
    return decorated