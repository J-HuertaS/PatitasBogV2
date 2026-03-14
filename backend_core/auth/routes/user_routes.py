from flask import Blueprint
from auth.controllers.profile_controller import ProfileController
from config.db_decorator import with_db

users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("/<int:user_id>", methods=["GET"])
@with_db
def get_public_profile(db, user_id):
    return ProfileController.get_public_profile(db, user_id)