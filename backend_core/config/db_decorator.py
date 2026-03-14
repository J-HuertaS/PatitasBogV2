from functools import wraps
from config.db_session import get_db


def with_db(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        db = get_db()

        try:
            result = f(db, *args, **kwargs)
            db.commit()
            return result

        except Exception:
            db.rollback()
            raise

    return decorated