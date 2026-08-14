from pydantic import BaseModel, Field

class ResetPasswordSchema(BaseModel):
    token: str
    password: str = Field(min_length=8)