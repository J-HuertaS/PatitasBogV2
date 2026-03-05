
"""
Configuración de conexión a PostgreSQL/Supabase usando SQLAlchemy
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

# Importar modelos de datos
from models.user import User
from models.password_reset_token import PasswordResetToken
from sqlalchemy.ext.declarative import declarative_base

from dotenv import load_dotenv
load_dotenv()

from config.base import Base

# Obtener URL de conexión desde variables de entorno
DATABASE_URL = os.getenv('DATABASE_URL')

# Crear el engine de SQLAlchemy con parámetros recomendados para PgBouncer (Supabase pooler)
engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=0,
    pool_recycle=3600
)

# Crear la fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Inicializa la base de datos y crea las tablas si no existen."""
    try:
        print(f'Conectando a PostgreSQL/Supabase: {DATABASE_URL}')
        # Importa los modelos para que se creen las tablas
        from models.user import User
        from models.password_reset_token import PasswordResetToken
        Base.metadata.create_all(bind=engine)
        print('Tablas creadas y conexión exitosa.')
    except OperationalError as e:
        print(f'Error conectando a la base de datos: {e}')
        raise e

from config.database import SessionLocal

def get_db():
    return SessionLocal()
