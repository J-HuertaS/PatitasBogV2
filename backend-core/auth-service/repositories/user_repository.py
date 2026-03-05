from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from models.user import User


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: User):
        """Crear un nuevo usuario en la base de datos"""
        self.db.add(user)
        try:
            self.db.commit()
            self.db.refresh(user)
            return user
        except IntegrityError:
            self.db.rollback()
            raise ValueError("El correo o username ya está registrado")

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email.lower()).first()

    def get_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()

    def save(self, user: User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user