from functools import wraps
from flask import request, current_app, g, jsonify
import jwt

from utils.token_service import TokenService


def auth_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Authorization header missing"}), 401


        parts = auth_header.split(" ")

        if len(parts) != 2 or parts[0] != "Bearer":
            return jsonify({"message": "Invalid Authorization header"}), 401


        token = parts[1]

        token_service = TokenService(current_app.config["JWT_SECRET"])

        try:

            payload = token_service.verify_token(token)

            g.user_id = payload["sub"]

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401


        return f(*args, **kwargs)

    return decorated