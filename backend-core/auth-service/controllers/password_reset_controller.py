"""
Controlador para restablecimiento de contraseñas
"""
import bcrypt
from flask import current_app # Asegúrate que current_app esté importado
from models.user import User
from models.password_reset_token import PasswordResetToken
from services.email_service import EmailService
import hashlib

class PasswordResetController:
    """Controlador para operaciones de restablecimiento de contraseña"""
    
    @staticmethod
    def request_password_reset(request_data):
        """
        Solicitar restablecimiento de contraseña
        
        Args:
            request_data (dict): Datos del request con email
            
        Returns:
            tuple: (response_data, status_code)
        """
        try:
            email_value = request_data.get('email') # Obtener el valor primero

            if isinstance(email_value, str): # Verificar si es una cadena
                email = email_value.strip().lower()
            elif email_value is None: # Si la clave 'email' no existe
                 email = '' # Asignar cadena vacía para que las validaciones posteriores funcionen
            else:
                # Si 'email' existe pero no es una cadena (inesperado)
                # Usar current_app.logger si está disponible y configurado, sino print
                if hasattr(current_app, 'logger'):
                    current_app.logger.error(f"Formato inesperado para 'email' en request_data: {type(email_value)}")
                else:
                    print(f"ERROR: Formato inesperado para 'email' en request_data: {type(email_value)}")
                return {'message': 'Formato de email inválido en la solicitud.'}, 400
            
            print(f'🔐 Solicitud de reset para: {email}')
            
            # Validar que el email esté presente
            if not email:
                return {'message': 'El correo electrónico es obligatorio'}, 400
            
            # Validar formato de email
            if not User.validate_email(email):
                return {'message': 'El formato del correo electrónico no es válido'}, 400
            
            # Buscar usuario por email
            user = User.find_by_email(email)
            
            if not user:
                print(f'❌ Usuario no encontrado: {email}')
                # Por seguridad, no revelamos si el email existe o no
                return {
                    'message': 'Si el correo está registrado, recibirás un código para restablecer tu contraseña'
                }, 200
            
            # Safely access full_name, providing a default if it's missing or None
            user_display_name = getattr(user, 'full_name', None) or user.email # Use email as fallback
            print(f'✅ Usuario encontrado: {user_display_name}')
            
            # Invalidar tokens existentes del usuario
            PasswordResetToken.invalidate_user_tokens(user._id)
            
            # Generar nuevo código y su hash
            raw_code, code_hash = PasswordResetToken.generate_token() # Ahora devuelve código y hash
            
            # Crear registro del token (ahora código hash) en la base de datos
            reset_token_entry = PasswordResetToken(
                user_id=user._id,
                token=code_hash  # Guardar el hash del código
            )
            
            token_id = reset_token_entry.save()
            print(f'✅ Código de reset (hash) guardado: {token_id}')
            
            # Enviar email de restablecimiento con el código original
            email_sent = EmailService.send_password_reset_email(
                user_email=user.email,
                user_name=user_display_name, # Use the safe display name
                reset_code=raw_code  # Enviamos el código original, no el hash
            )
            
            if email_sent:
                print(f'✅ Email con código enviado a: {email}')
                return {
                    'message': 'Si el correo está registrado, recibirás un código para restablecer tu contraseña'
                }, 200
            else:
                print(f'❌ Error enviando email a: {email}')
                return {
                    'message': 'Error enviando email. Intenta nuevamente más tarde'
                }, 500
                
        except Exception as e:
            print(f'❌ Error en request_password_reset: {e}')
            return {
                'message': 'Error procesando solicitud',
                'error': str(e)
            }, 500
    
    @staticmethod
    def verify_reset_token(request_data):
        """
        Verificar si un código de reset es válido
        
        Args:
            request_data (dict): Datos del request con email y código
            
        Returns:
            tuple: (response_data, status_code)
        """
        try:
            email = request_data.get('email', '').strip().lower()
            code_from_user = request_data.get('token', '').strip() # Changed 'code' to 'token'
            
            print(f'🔐 Verificando código: {code_from_user} para email: {email}')
            
            if not email or not code_from_user:
                return {'message': 'El correo electrónico y el código son obligatorios'}, 400
            
            user = User.find_by_email(email)
            if not user:
                # No revelar si el email existe
                return {'message': 'Código inválido o expirado'}, 400
                
            # Hashear el código proporcionado por el usuario para compararlo
            code_hash_from_user = hashlib.sha256(code_from_user.encode('utf-8')).hexdigest()
            
            # Buscar el token (código hash) en la base de datos
            reset_token_entry = PasswordResetToken.find_valid_token_by_hash(user._id, code_hash_from_user)
            
            if not reset_token_entry:
                print(f'❌ Código inválido o expirado para: {email}')
                return {'message': 'Código inválido o expirado'}, 400
            
            print(f'✅ Código verificado para: {email}')
            # Opcional: Marcar el token como usado si la verificación es el último paso antes del reset
            # reset_token_entry.mark_as_used()
            return {'message': 'Código verificado correctamente', 'user_id': str(user._id)}, 200
            
        except Exception as e:
            print(f'❌ Error en verify_reset_token: {e}')
            return {'message': 'Error procesando solicitud', 'error': str(e)}, 500

    @staticmethod
    def reset_password(request_data):
        """
        Restablecer contraseña con token válido
        
        Args:
            request_data (dict): Datos del request con token y nueva contraseña
            
        Returns:
            tuple: (response_data, status_code)
        """
        try:
            token = request_data.get('token', '').strip()
            new_password = request_data.get('newPassword', '') # Changed 'password' to 'newPassword'
            
            print(f'🔐 Restablecimiento de contraseña con token')
            
            # Validaciones básicas
            if not token:
                return {'message': 'Token requerido'}, 400
            
            if not new_password:
                return {'message': 'La nueva contraseña es obligatoria'}, 400
            
            # Validar longitud de contraseña
            if len(new_password) < 6:
                return {'message': 'La contraseña debe tener al menos 6 caracteres'}, 400
            
            # Validar fortaleza de contraseña (misma validación que registro)
            import re
            pattern = r'(?=.*[a-z])(?=.*[A-Z])(?=.*\d)'
            if not re.match(pattern, new_password):
                return {
                    'message': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
                }, 400
            
            # Hash del token para búsqueda
            token_hash = hashlib.sha256(token.encode()).hexdigest()
            
            # Buscar y validar token
            reset_token = PasswordResetToken.find_by_token(token_hash)
            
            if not reset_token or not reset_token.is_valid():
                return {
                    'message': 'Token inválido o expirado'
                }, 400
            
            # Buscar usuario
            user = User.find_by_id(reset_token.user_id)
            
            if not user:
                return {'message': 'Usuario no encontrado'}, 400
            
            # Hashear nueva contraseña
            password_bytes = new_password.encode('utf-8')
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
            
            # Actualizar contraseña del usuario
            user.password = hashed_password
            user.save()
            
            # Marcar token como usado
            reset_token.mark_as_used()
            
            # Invalidar todos los demás tokens del usuario
            PasswordResetToken.invalidate_user_tokens(user._id)
            
            print(f'✅ Contraseña restablecida para: {user.email}')
            
            return {
                'message': 'Contraseña restablecida exitosamente'
            }, 200
            
        except Exception as e:
            print(f'❌ Error en reset_password: {e}')
            return {
                'message': 'Error restableciendo contraseña',
                'error': str(e)
            }, 500
