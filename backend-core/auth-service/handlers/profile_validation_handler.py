"""
Handlers para validación de actualización de perfil
"""
import re
from models.user import User
from utils.handler_template import Handler

class ProfileValidationHandler(Handler):
    """Handler base para validaciones de perfil"""
    pass

class full_nameValidationHandler(ProfileValidationHandler):
    """Validar nombre completo en perfil"""
    
    async def handle(self, context, response_handler):
        full_name = context.get('full_name')
        
        if full_name is not None:  # Solo validar si se envía
            full_name = full_name.strip()
            if len(full_name) < 2:
                response_handler({
                    'message': 'El nombre debe tener al menos 2 caracteres'
                }, 400)
                return False
        
        return await super().handle(context, response_handler)

class EmailValidationHandler(ProfileValidationHandler):
    """Validar email en perfil"""
    
    async def handle(self, context, response_handler):
        email = context.get('email')
        current_user_id = context.get('current_user_id')
        
        if email is not None:  # Solo validar si se envía
            email = email.strip().lower()
            
            # Validar formato
            if not User.validate_email(email):
                response_handler({
                    'message': 'El formato del correo electrónico no es válido'
                }, 400)
                return False
            
            # Verificar que no esté en uso por otro usuario
            existing_user = User.find_by_email(email)
            if existing_user and existing_user._id != current_user_id:
                response_handler({
                    'message': 'El correo ya está en uso por otro usuario'
                }, 400)
                return False
        
        return await super().handle(context, response_handler)

class UsernameValidationHandler(ProfileValidationHandler):
    """Validar username en perfil"""
    
    async def handle(self, context, response_handler):
        username = context.get('username')
        current_user_id = context.get('current_user_id')
        
        if username is not None:  # Solo validar si se envía
            username = username.strip() if username else None
            
            if username:  # Si no está vacío, validar
                if not User.validate_username(username):
                    response_handler({
                        'message': 'Username inválido. Debe tener 3-20 caracteres y solo letras, números y guiones bajos'
                    }, 400)
                    return False
                
                # Verificar que no esté en uso por otro usuario
                existing_user = User.find_by_username(username)
                if existing_user and existing_user._id != current_user_id:
                    response_handler({
                        'message': 'El nombre de usuario ya está en uso'
                    }, 400)
                    return False
        
        return await super().handle(context, response_handler)

class GenderValidationHandler(ProfileValidationHandler):
    """Validar género en perfil"""
    
    async def handle(self, context, response_handler):
        gender = context.get('gender')
        
        if gender is not None:  # Solo validar si se envía
            if not User.validate_gender(gender):
                response_handler({
                    'message': 'Género inválido. Opciones: male, female, other, prefer_not_to_say'
                }, 400)
                return False
        
        return await super().handle(context, response_handler)

class PhoneValidationHandler(ProfileValidationHandler):
    """Validar teléfono en perfil"""
    
    async def handle(self, context, response_handler):
        phone_number = context.get('phoneNumber')
        
        if phone_number is not None:  # Solo validar si se envía
            phone_number = phone_number.strip() if phone_number else None
            
            if phone_number and not User.validate_phone_number(phone_number):
                response_handler({
                    'message': 'Número de teléfono inválido'
                }, 400)
                return False
        
        return await super().handle(context, response_handler)

class AddressValidationHandler(ProfileValidationHandler):
    """Validar dirección en perfil"""
    
    async def handle(self, context, response_handler):
        address = context.get('address')
        
        if address is not None:  # Solo validar si se envía
            address = address.strip() if address else None
            
            if address and not User.validate_address(address):
                response_handler({
                    'message': 'Dirección inválida. Debe tener entre 5 y 200 caracteres'
                }, 400)
                return False
        
        return await super().handle(context, response_handler)
