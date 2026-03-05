"""
Modelo de Usuario para SQLAlchemy/PostgreSQL
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from config.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)  # Contraseña hasheada
    username = Column(String(30), unique=True, nullable=True, index=True)
    profile_picture = Column(String(255), nullable=True)
    gender = Column(String(20), nullable=True)  # 'male', 'female', 'other', 'prefer_not_to_say'
    address = Column(String(200), nullable=True)
    phone_number = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username})>"
