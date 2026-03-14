
"""
Modelo para tokens de restablecimiento de contraseña (SQLAlchemy/PostgreSQL)
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from config.base import Base


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    token = Column(String(64), nullable=False, index=True)  # Hash del código
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<PasswordResetToken(id={self.id}, user_id={self.user_id}, used={self.used})>"
