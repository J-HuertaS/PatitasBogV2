from pydantic import BaseModel

class ForgotPasswordSchema(BaseModel):
    email: str