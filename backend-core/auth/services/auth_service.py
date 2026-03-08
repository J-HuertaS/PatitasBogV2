from auth.models.user import User
from auth.models.password_reset_token import PasswordResetToken
from auth.repositories.password_reset_token_repository import PasswordResetTokenRepository
from auth.repositories.user_repository import UserRepository
from auth.utils.password import hash_password, verify_password
from auth.utils.email_service import EmailService
from auth.utils.audit_service import AuditService
from auth.utils.token_service import TokenService

import secrets
import hashlib
from datetime import datetime, timedelta


class AuthService:

    def __init__(
        self,
        user_repository: UserRepository,
        email_service: EmailService,
        token_service: TokenService,
        audit_service: AuditService,
        password_token_repository: PasswordResetTokenRepository
    ):
        self.user_repository = user_repository
        self.password_token_repository = password_token_repository
        self.email_service = email_service
        self.token_service = token_service
        self.audit_service = audit_service


    def register_user(self, user_data: dict) -> User:

        self._validate_user_data(user_data)

        user_data["password_hash"] = hash_password(user_data["password"])
        user_data.pop("password", None)

        user = User(**user_data)

        user = self.user_repository.create_user(user)

        self.audit_service.log_security_event(
            user.id,
            user.email,
            "REGISTER"
        )

        self.email_service.send_welcome_email(user.email, user.full_name)

        return user


    def authenticate_user(self, identifier, password):

        user = (
            self.user_repository.get_by_email(identifier)
            or self.user_repository.get_by_username(identifier)
        )

        if not user or not verify_password(password, user.password_hash):

            self.audit_service.log_failed_authentication(
                identifier,
                "Invalid credentials"
            )

            return None

        token = self.token_service.generate_token(user)

        self.audit_service.log_security_event(
            user.id,
            user.email,
            "LOGIN"
        )

        return user, token


    def request_password_reset(self, email):

        user = self.user_repository.get_by_email(email)

        if not user:
            return

        self.password_token_repository.invalidate_user_tokens(user.id)

        code = secrets.token_hex(32)

        token_hash = hashlib.sha256(code.encode()).hexdigest()

        reset_token = PasswordResetToken(
            user_id=user.id,
            token=token_hash,
            expires_at=datetime.utcnow() + timedelta(hours=1)
        )

        self.password_token_repository.save(reset_token)

        self.email_service.send_password_reset_email(
            user.email,
            code
        )

        self.audit_service.emit_event(
            "PASSWORD_RESET_REQUESTED",
            user_id=user.id,
            email=user.email
        )


    def reset_password(self, token, new_password):

        token_hash = hashlib.sha256(token.encode()).hexdigest()

        reset_token = self.password_token_repository.find_valid_by_hash(token_hash)

        if not reset_token:

            self.audit_service.emit_event(
                "PASSWORD_RESET_FAILED",
                reason="Invalid or expired token"
            )

            raise ValueError("Invalid or expired token")

        user = self.user_repository.get_by_id(reset_token.user_id)

        if not user:
            raise ValueError("User not found")

        user.password_hash = hash_password(new_password)

        self.user_repository.save(user)

        self.password_token_repository.mark_used(reset_token)

        self.audit_service.log_password_change(
            user.id,
            user.email,
            success=True
        )

        return user


    def _validate_user_data(self, user_data: dict):

        required_fields = ["full_name", "email", "username", "password"]

        for field in required_fields:
            if not user_data.get(field):
                raise ValueError(f"{field} is required")

        existing_user = self.user_repository.get_by_email(user_data["email"])
        if existing_user:
            raise ValueError("Email already registered")

        existing_user = self.user_repository.get_by_username(user_data["username"])
        if existing_user:
            raise ValueError("Username already taken")