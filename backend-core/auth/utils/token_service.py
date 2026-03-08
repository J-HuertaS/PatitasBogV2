import jwt
from datetime import datetime, timedelta


class TokenService:

    def __init__(self, secret_key):
        self.secret_key = secret_key


    def generate_token(self, user, expires_in=3600):

        payload = {
            "sub": str(user.id),
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(seconds=expires_in)
        }

        token = jwt.encode(
            payload,
            self.secret_key,
            algorithm="HS256"
        )

        return token


    def verify_token(self, token):

        payload = jwt.decode(
            token,
            self.secret_key,
            algorithms=["HS256"]
        )

        return payload