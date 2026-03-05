from flask import Blueprint
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from controllers.auth_controller import AuthController
from config.database import get_db

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

limiter = Limiter(key_func=get_remote_address)

@auth_bp.route("/register", methods=["POST"])
def register():
    db = get_db()
    return AuthController.register(db)


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    db = get_db()
    return AuthController.login(db)


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    db = get_db()
    return AuthController.forgot_password(db)


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    db = get_db()
    return AuthController.reset_password(db)