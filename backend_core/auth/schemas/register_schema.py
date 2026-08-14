from pydantic import BaseModel, EmailStr, Field

class RegisterSchema(BaseModel):
    full_name: str
    email: EmailStr
    username: str
    password: str = Field(min_length=8)
    