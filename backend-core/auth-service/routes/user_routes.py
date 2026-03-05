from flask import Blueprint
from controllers.profile_controller import ProfileController
from config.database import get_db

users_bp = Blueprint("users", __name__, url_prefix="/users")


@users_bp.route("/<int:user_id>", methods=["GET"])
def get_public_profile(user_id):

    db = next(get_db())

    return ProfileController.get_public_profile(db, user_id)