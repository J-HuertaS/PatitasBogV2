from datetime import datetime
from sqlalchemy.orm import Session
from models.password_reset_token import PasswordResetToken


class PasswordResetTokenRepository:

    def __init__(self, db: Session):
        self.db = db


    def save(self, token: PasswordResetToken):
        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return token


    def find_valid_by_hash(self, token_hash: str):
        now = datetime.utcnow()

        return self.db.query(PasswordResetToken).filter(
            PasswordResetToken.token == token_hash,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > now
        ).first()


    def invalidate_user_tokens(self, user_id: int):
        now = datetime.utcnow()

        self.db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user_id,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > now
        ).update({PasswordResetToken.used: True})

        self.db.commit()


    def mark_used(self, token: PasswordResetToken):
        token.used = True
        self.db.commit()
        self.db.refresh(token)
        return token