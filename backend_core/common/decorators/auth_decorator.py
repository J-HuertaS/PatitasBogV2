from functools import wraps
from flask import request, g, jsonify
import jwt

from common.decorators import jwt_service
from auth.repositories.user_repository import UserRepository
from config.db_session import get_db


def auth_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Authorization header missing"}), 401

        try:
            scheme, token = auth_header.split()

            if scheme.lower() != "bearer":
                raise ValueError()

        except ValueError:
            return jsonify({"message": "Invalid Authorization header"}), 401

        try:

            payload = jwt_service.token_service.verify_token(token)

            user_id = int(payload["sub"])

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401


        db = get_db()

        user_repo = UserRepository(db)

        user = user_repo.get_by_id(user_id)

        if not user:
            return jsonify({"message": "User not found"}), 401

        g.user = user
        g.user_id = user.id

        return f(*args, **kwargs)

    return decorated