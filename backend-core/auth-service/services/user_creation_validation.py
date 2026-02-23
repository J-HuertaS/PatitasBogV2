"""
Servicio para crear la cadena de validación de usuarios
"""
from handlers.user_creation_handler import (
    RequiredFieldsHandler,
    full_nameHandler,
    ValidEmailHandler,
    PasswordLengthHandler,
    StrongPasswordHandler,
    ExistingUserHandler
)

def create_user_validation_chain():
    """Crear la cadena de validación para registro de usuarios"""
    
    # Crear instancias de cada handler
    required_fields = RequiredFieldsHandler()
    full_name_validator = full_nameHandler()
    email_validator = ValidEmailHandler()
    password_length = PasswordLengthHandler()
    password_strength = StrongPasswordHandler()
    existing_user = ExistingUserHandler()
    
    # Construir la cadena
    required_fields.set_next(full_name_validator) \
                  .set_next(email_validator) \
                  .set_next(password_length) \
                  .set_next(password_strength) \
                  .set_next(existing_user)
    
    return required_fields
