from flask import Flask, jsonify
from dotenv import load_dotenv
import os

from common.security.jwt_service import init_jwt
from config.database import Base, engine

from auth.routes.auth_routes import auth_bp
from auth.routes.profile_routes import profile_bp
from auth.routes.user_routes import users_bp
from reports.routes.report_routes import report_routes
from reports.routes.response_routes import response_routes


# importar modelos
from reports.models.report import Report
from reports.models.report_image import ReportImage
from reports.models.response import Response
from reports.models.response_image import ResponseImage
from reports.models.comment import Comment

from auth.models.user import User
from auth.models.password_reset_token import PasswordResetToken


from config.db_session import close_db


def create_app():

    load_dotenv()

    app = Flask(__name__)

    @app.route("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    configure_app(app)
    register_extensions(app)
    register_blueprints(app)
    app.teardown_appcontext(close_db)

    Base.metadata.create_all(bind=engine)

    return app


def configure_app(app):

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


def register_extensions(app):

    init_jwt(app)


def register_blueprints(app):

    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(users_bp)

    app.register_blueprint(report_routes)
    app.register_blueprint(response_routes)