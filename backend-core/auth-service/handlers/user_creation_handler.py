"""
Handlers para validación de creación de usuarios
"""
import re
from models.user import User
from utils.handler_template import Handler

class RequiredFieldsHandler(Handler):
    """Validar que todos los campos requeridos estén presentes"""
    
    async def handle(self, context, response_handler):
        full_name = context.get('full_name', '').strip() # Cambiado a full_name
        email = context.get('email', '').strip()
        password = context.get('password', '')
        
        if not full_name or not email or not password:
            response_handler({
                'message': 'Todos los campos son obligatorios (nombre, email, contraseña)'
            }, 400)
            return False
        
        return await super().handle(context, response_handler)

class full_nameHandler(Handler):
    """Validar longitud del nombre completo"""
    
    async def handle(self, context, response_handler):
        full_name = context.get('full_name', '').strip() # Cambiado a full_name
        
        if len(full_name) < 2:
            response_handler({
                'message': 'El nombre debe tener al menos 2 caracteres'
            }, 400)
            return False
        
        return await super().handle(context, response_handler)

class ValidEmailHandler(Handler):
    """Validar formato del email"""
    
    async def handle(self, context, response_handler):
        email = context.get('email', '')
        
        if not User.validate_email(email):
            response_handler({
                'message': 'El formato del correo electrónico no es válido'
            }, 400)
            return False
        
        return await super().handle(context, response_handler)

class PasswordLengthHandler(Handler):
    """Validar longitud mínima de la contraseña"""
    
    async def handle(self, context, response_handler):
        password = context.get('password', '')
        
        if len(password) < 6:
            response_handler({
                'message': 'La contraseña debe tener al menos 6 caracteres'
            }, 400)
            return False
        
        return await super().handle(context, response_handler)

class StrongPasswordHandler(Handler):
    """Validar que la contraseña sea fuerte"""
    
    async def handle(self, context, response_handler):
        password = context.get('password', '')
        
        # Verificar mayúscula, minúscula y número
        pattern = r'(?=.*[a-z])(?=.*[A-Z])(?=.*\d)'
        if not re.match(pattern, password):
            response_handler({
                'message': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
            }, 400)
            return False
        
        return await super().handle(context, response_handler)

class ExistingUserHandler(Handler):
    """Validar que el email no esté ya registrado"""
    
    async def handle(self, context, response_handler):
        email = context.get('email', '')
        
        try:
            existing_user = User.find_by_email(email)
            if existing_user:
                response_handler({
                    'message': 'El correo ya está registrado'
                }, 400)
                return False
            
            return await super().handle(context, response_handler)
            
        except Exception as e:
            response_handler({
                'message': 'Error verificando usuario existente',
                'error': str(e)
            }, 500)
            return False
