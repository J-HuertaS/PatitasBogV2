"""
ProfileController
Capa HTTP para gestión de perfil
"""

from flask import request, jsonify, g

from auth.repositories.user_repository import UserRepository
from auth.services.profile_service import ProfileService
from common.services.audit_service import AuditService
from common.security.auth_decorator import auth_required
from common.services.storage_service import StorageService


class ProfileController:

    @staticmethod
    def build_service(db):
        user_repository = UserRepository(db)
        audit_service = AuditService()

        return ProfileService(user_repository, audit_service)

    @staticmethod
    @auth_required
    def get_profile(db):

        profile_service = ProfileController.build_service(db)

        profile = profile_service.get_user_profile(g.user_id)

        return jsonify(profile), 200
    
    @staticmethod
    def get_public_profile(db, user_id):

        profile_service = ProfileController.build_service(db)

        user = profile_service.get_public_profile(user_id)

        return jsonify({
            "user": user
        }), 200


    @staticmethod
    @auth_required
    def update_profile(db):

        data = request.get_json()

        profile_service = ProfileController.build_service(db)

        user = profile_service.update_profile(g.user_id, data)

        return jsonify({
            "message": "Profile updated",
            "user_id": user.id
        }), 200


    @staticmethod
    @auth_required
    def upload_profile_picture(db):

        if "image" not in request.files:
            return jsonify({"message": "Image file required"}), 400

        file = request.files["image"]

        storage_service = StorageService()

        try:

            image_url = storage_service.upload_profile_picture(
                file,
                g.user_id
            )

        except ValueError as e:

            return jsonify({
                "message": str(e)
            }), 400

        profile_service = ProfileController.build_service(db)

        profile_service.upload_profile_picture(
            g.user_id,
            image_url
        )

        return jsonify({
            "message": "Profile picture updated",
            "profile_picture": image_url
        }), 200
    
    @staticmethod    
    @auth_required
    def delete_profile_picture(db): 

        storage_service = StorageService()

        try:

            storage_service.upload_profile_picture(
                None,
                g.user_id
            )

        except ValueError as e:

            import logging

            logger = logging.getLogger(__name__)

            logger.exception("Register error")

            return jsonify({
                "message": str(e)
            }), 400

        profile_service = ProfileController.build_service(db)

        profile_service.upload_profile_picture(
            g.user_id,
            None
        )

        return jsonify({
            "message": "Profile picture deleted",
            "profile_picture": None
        }), 200