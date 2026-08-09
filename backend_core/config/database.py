"""
Configuración de conexión a PostgreSQL/Supabase usando SQLAlchemy
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv

from config.base import Base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    pool_recycle=1800
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def init_db():
    """Inicializa la base de datos y crea tablas."""
    try:
        print(f"Conectando a PostgreSQL/Supabase")

        # Importar modelos para que SQLAlchemy los registre
        from auth.models.user import User
        from auth.models.password_reset_token import PasswordResetToken
        from reports.models.report import Report
        from reports.models.response import Response

        Base.metadata.create_all(bind=engine)

        print("Tablas creadas correctamente.")

    except OperationalError as e:
        print(f"Error conectando a la base de datos: {e}")
        raise e
