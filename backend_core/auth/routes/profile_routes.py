from flask import Blueprint
from auth.controllers.profile_controller import ProfileController
from common.security.protected_route import protected_route


profile_bp = Blueprint("profile", __name__, url_prefix="/profile")


# perfil propio
@profile_bp.route("", methods=["GET"])
@protected_route
def get_profile(db):
    return ProfileController.get_profile(db)


# actualizar perfil
@profile_bp.route("", methods=["PUT"])
@protected_route
def update_profile(db):
    return ProfileController.update_profile(db)


# subir foto
@profile_bp.route("/picture", methods=["POST"])
@protected_route
def upload_picture(db):
    return ProfileController.upload_profile_picture(db)


# borrar foto
@profile_bp.route("/picture", methods=["DELETE"])
@protected_route
def delete_picture(db):
    return ProfileController.delete_profile_picture(db)