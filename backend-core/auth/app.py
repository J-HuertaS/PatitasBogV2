from flask import Flask, jsonify
from dotenv import load_dotenv
import os

from auth.routes.auth_routes import auth_bp
from auth.routes.profile_routes import profile_bp
from auth.routes.user_routes import users_bp

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)



def create_app():

    # cargar variables del .env
    load_dotenv()

    app = Flask(__name__)

    # pasar variables a Flask config
    app.config["JWT_SECRET"] = os.getenv("JWT_SECRET")
    app.config["DATABASE_URL"] = os.getenv("DATABASE_URL")
    app.config["SMTP_SERVER"] = os.getenv("SMTP_SERVER")
    app.config["SMTP_PORT"] = os.getenv("SMTP_PORT")
    app.config["SMTP_USERNAME"] = os.getenv("SMTP_USERNAME")
    app.config["SMTP_PASSWORD"] = os.getenv("SMTP_PASSWORD")
    app.config["FROM_EMAIL"] = os.getenv("FROM_EMAIL")
    app.config["FRONTEND_URL"] = os.getenv("FRONTEND_URL")
    app.config["SUPABASE_URL"] = os.getenv("SUPABASE_URL")
    app.config["SUPABASE_SERVICE_ROLE_KEY"] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    app.config["SUPABASE_BUCKET"] = os.getenv("SUPABASE_BUCKET")

    # registrar rutas
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(users_bp)

    @app.route("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app


app = create_app()