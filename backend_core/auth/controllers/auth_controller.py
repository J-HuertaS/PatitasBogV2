from flask import request, jsonify, current_app

from auth.repositories.user_repository import UserRepository
from auth.repositories.password_reset_token_repository import PasswordResetTokenRepository

from auth.services.auth_service import AuthService

from common.security.token_service import TokenService
from common.services.email_service import EmailService
from common.services.audit_service import AuditService

from pydantic import ValidationError

# Schemas
from auth.schemas.register_schema import RegisterSchema
from auth.schemas.login_schema import LoginSchema
from auth.schemas.forgot_password_schema import ForgotPasswordSchema
from auth.schemas.reset_password_schema import ResetPasswordSchema


class AuthController:


    @staticmethod
    def build_service(db):

        user_repository = UserRepository(db)
        password_token_repository = PasswordResetTokenRepository(db)

        email_service = EmailService()
        token_service = TokenService(current_app.config["JWT_SECRET"])
        audit_service = AuditService()

        return AuthService(
            user_repository,
            email_service,
            token_service,
            audit_service,
            password_token_repository    
        )


    @staticmethod
    def register(db):

        try:

            data = RegisterSchema(**request.json)

            data = data.dict()

        except ValidationError as e:
            return jsonify({
                "message": str(e)
            }), 400

        auth_service = AuthController.build_service(db)

        try:
            user = auth_service.register_user(data)

            return jsonify({
                "id": user.id,
                "email": user.email,
                "username": user.username
            }), 201

        except ValueError as e:

            return jsonify({
                "message": str(e)
            }), 400

        except Exception as e:
            import logging

            logger = logging.getLogger(__name__)

            logger.exception("Register error")

            return jsonify({
                "message": "Internal server error"
            }), 500

    @staticmethod
    def login(db):

        try:

            data = LoginSchema(**request.json)
            data = data.dict()
            identifier = data.identifier
            password = data.password

        except ValidationError as e:
            return jsonify({
                "message": str(e)
            }), 400


        auth_service = AuthController.build_service(db)

        result = auth_service.authenticate_user(identifier, password)

        if not result:
            return jsonify({"message": "Invalid credentials"}), 401

        user, token = result

        return jsonify({
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username
            }
        }), 200


    @staticmethod
    def forgot_password(db):

        data = request.get_json()

        email = data.get("email")

        if not email:
            return jsonify({"message": "email is required"}), 400

        auth_service = AuthController.build_service(db)

        auth_service.request_password_reset(email)

        return jsonify({
            "message": "If the email exists, a reset link was sent"
        }), 200


    @staticmethod
    def reset_password(db):

        data = request.get_json()

        token = data.get("token")
        password = data.get("password")

        if not token or not password:
            return jsonify({"message": "token and password are required"}), 400

        auth_service = AuthController.build_service(db)

        auth_service.reset_password(token, password)

        return jsonify({
            "message": "Password updated"
        }), 200