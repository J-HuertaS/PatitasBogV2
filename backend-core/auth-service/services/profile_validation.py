"""
Servicio para crear la cadena de validación de perfil
"""
from handlers.profile_validation_handler import (
    full_nameValidationHandler,
    EmailValidationHandler,
    UsernameValidationHandler,
    GenderValidationHandler,
    PhoneValidationHandler,
    AddressValidationHandler
)

def create_profile_validation_chain():
    """Crear la cadena de validación para actualización de perfil"""
    
    # Crear instancias de cada handler
    full_name_validator = full_nameValidationHandler()
    email_validator = EmailValidationHandler()
    username_validator = UsernameValidationHandler()
    gender_validator = GenderValidationHandler()
    phone_validator = PhoneValidationHandler()
    address_validator = AddressValidationHandler()
    
    # Construir la cadena
    full_name_validator.set_next(email_validator) \
                     .set_next(username_validator) \
                     .set_next(gender_validator) \
                     .set_next(phone_validator) \
                     .set_next(address_validator)
    
    return full_name_validator
