import hashlib

from repositories.user_repository import UserRepository
from utils.audit_service import AuditService
import time


class ProfileService:

    ALLOWED_FIELDS = {
        "username",
        "full_name",
        "profile_picture",
        "gender",
        "address",
        "phone_number"
    }

    def __init__(self, user_repository: UserRepository, audit_service: AuditService):
        self.user_repository = user_repository
        self.audit_service = audit_service


    def get_user_profile(self, user_id):
        user = self.user_repository.get_by_id(user_id)

        if not user:
            raise ValueError("User not found")
        
        profile_picture = user.profile_picture

        if profile_picture:

            profile_picture = f"{profile_picture}?t={int(time.time())}"

        else:

            email_hash = hashlib.md5(user.email.strip().lower().encode()).hexdigest()

            profile_picture = f"https://www.gravatar.com/avatar/{email_hash}?d=identicon&s=512"

        return {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
            "profile_picture": user.profile_picture,
            "gender": user.gender,
            "address": user.address,
            "phone_number": user.phone_number,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    
    def get_public_profile(self, user_id):

        user = self.user_repository.get_by_id(user_id)

        if not user:
            raise ValueError("User not found")

        profile_picture = user.profile_picture

        if profile_picture:
            import time
            profile_picture = f"{profile_picture}?t={int(time.time())}"

        else:
            import hashlib

            email_hash = hashlib.md5(
                user.email.strip().lower().encode()
            ).hexdigest()

            profile_picture = f"https://www.gravatar.com/avatar/{email_hash}?d=identicon&s=512"

        return {
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "profile_picture": profile_picture,
            "created_at": user.created_at
        }


    def update_profile(self, user_id, update_data):
        user = self.user_repository.get_by_id(user_id)

        if not user:
            raise ValueError("User not found")

        # verificar username único
        if "username" in update_data:
            existing_user = self.user_repository.get_by_username(update_data["username"])

            if existing_user and existing_user.id != user_id:
                raise ValueError("Username already taken")

        updated_fields = {}

        # actualizar campos permitidos
        for key, value in update_data.items():
            if key in self.ALLOWED_FIELDS:
                setattr(user, key, value)
                updated_fields[key] = value

        self.user_repository.save(user)

        # auditoría
        if updated_fields:
            self.audit_service.log_profile_update(
                user.id,
                user.email,
                updated_fields
            )

        return user


    def upload_profile_picture(self, user_id, picture_url):

        user = self.user_repository.get_by_id(user_id)

        if not user:
            raise ValueError("User not found")

        user.profile_picture = picture_url

        self.user_repository.save(user)

        self.audit_service.log_profile_picture_upload(
            user.id,
            user.email,
            success=True
        )

        return user