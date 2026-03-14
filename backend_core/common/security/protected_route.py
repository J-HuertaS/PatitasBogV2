from functools import wraps
from common.security.auth_decorator import auth_required
from config.db_decorator import with_db


def protected_route(f):

    @wraps(f)
    @auth_required
    @with_db
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)

    return decorated