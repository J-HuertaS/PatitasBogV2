from flask import Blueprint
from auth.controllers.profile_controller import ProfileController
from auth.utils.auth_decorator import auth_required
from config.database import get_db


profile_bp = Blueprint("profile", __name__, url_prefix="/profile")


# perfil propio
@profile_bp.route("", methods=["GET"])
@auth_required
def get_profile():
    db = next(get_db())
    return ProfileController.get_profile(db)


# actualizar perfil
@profile_bp.route("", methods=["PUT"])
@auth_required
def update_profile():
    db = next(get_db())
    return ProfileController.update_profile(db)


# subir foto
@profile_bp.route("/picture", methods=["POST"])
@auth_required
def upload_picture():
    db = next(get_db())
    return ProfileController.upload_profile_picture(db)


# borrar foto
@profile_bp.route("/picture", methods=["DELETE"])
@auth_required
def delete_picture():
    db = next(get_db())
    return ProfileController.delete_profile_picture(db)