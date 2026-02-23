"""
Modelos Swagger para documentación de la API
"""
from flask_restx import fields

def create_swagger_models(api):
    """Crear todos los modelos Swagger para la API"""
    
    # Modelo base de respuesta exitosa
    base_response = api.model('BaseResponse', {
        'message': fields.String(required=True, description='Mensaje de respuesta'),
        'success': fields.Boolean(description='Indica si la operación fue exitosa', default=True)
    })
    
    # Modelo de error
    error_response = api.model('ErrorResponse', {
        'message': fields.String(required=True, description='Mensaje de error'),
        'error': fields.String(description='Detalles técnicos del error')
    })
    
    # Modelos de Usuario
    user_registration = api.model('UserRegistration', {
        'full_name': fields.String(
            required=True, 
            description='Nombre completo del usuario (mínimo 2 caracteres)', 
            example='Juan Pérez'
        ),
        'email': fields.String(
            required=True, 
            description='Correo electrónico válido y único', 
            example='juan@ejemplo.com'
        ),
        'password': fields.String(
            required=True, 
            description='Contraseña (mín. 6 caracteres, debe contener mayúscula, minúscula y número)', 
            example='MiPassword123'
        )
    })
    
    user_login = api.model('UserLogin', {
        'email': fields.String(
            required=True, 
            description='Correo electrónico registrado', 
            example='juan@ejemplo.com'
        ),
        'password': fields.String(
            required=True, 
            description='Contraseña del usuario', 
            example='MiPassword123'
        )
    })
    
    user_info = api.model('UserInfo', {
        'id': fields.String(description='ID único del usuario'),
        'full_name': fields.String(description='Nombre completo'),
        'email': fields.String(description='Correo electrónico'),
        'username': fields.String(description='Nombre de usuario'),
        'gender': fields.String(description='Género', enum=['masculino', 'femenino', 'otro', 'prefiero_no_decir']),
        'address': fields.String(description='Dirección completa'),
        'phoneNumber': fields.String(description='Número de teléfono'),
        'profilePicture': fields.String(description='URL de la foto de perfil'),
        'hasPassword': fields.Boolean(description='Indica si tiene contraseña establecida'),
        'createdAt': fields.DateTime(description='Fecha de creación'),
        'updatedAt': fields.DateTime(description='Fecha de última actualización')
    })
    
    user_response = api.model('UserResponse', {
        'message': fields.String(description='Mensaje de respuesta'),
        'user': fields.Nested(user_info, description='Información del usuario'),
        'token': fields.String(description='Token JWT para autenticación')
    })
    
    # Modelos de Perfil
    profile_response = api.model('ProfileResponse', {
        'message': fields.String(description='Mensaje de respuesta'),
        'profile': fields.Nested(user_info, description='Información del perfil')
    })
    
    profile_update = api.model('ProfileUpdate', {
        'full_name': fields.String(description='Nombre completo (mín. 2 caracteres)', example='Juan Carlos Pérez'),
        'username': fields.String(description='Nombre de usuario (3-20 caracteres, alfanumérico + _)', example='juanperez'),
        'email': fields.String(description='Correo electrónico válido', example='juan@ejemplo.com'),
        'gender': fields.String(
            description='Género del usuario', 
            enum=['masculino', 'femenino', 'otro', 'prefiero_no_decir'], 
            example='masculino'
        ),
        'address': fields.String(description='Dirección completa (5-200 caracteres)', example='Calle 123 #45-67, Bogotá, Colombia'),
        'phoneNumber': fields.String(description='Número de teléfono internacional', example='+57 300 123 4567'),
        'profilePicture': fields.String(description='URL de la imagen de perfil', example='/static/uploads/profile.jpg')
    })
    
    profile_update_response = api.model('ProfileUpdateResponse', {
        'message': fields.String(description='Mensaje de confirmación'),
        'profile': fields.Nested(user_info, description='Perfil actualizado'),
        'updatedFields': fields.List(fields.String, description='Lista de campos actualizados')
    })
    
    password_change = api.model('PasswordChange', {
        'currentPassword': fields.String(
            required=True, 
            description='Contraseña actual del usuario', 
            example='OldPassword123'
        ),
        'newPassword': fields.String(
            required=True, 
            description='Nueva contraseña (mín. 6 caracteres, mayúscula + minúscula + número)', 
            example='NewPassword456'
        )
    })
    
    # Modelos de Restablecimiento de Contraseña
    forgot_password = api.model('ForgotPassword', {
        'email': fields.String(
            required=True, 
            description='Correo electrónico del usuario registrado', 
            example='juan@ejemplo.com'
        )
    })
    
    verify_token = api.model('VerifyToken', {
        'email': fields.String(  # Add email field
            required=True, 
            description='Correo electrónico del usuario', 
            example='juan@ejemplo.com'
        ),
        'token': fields.String(
            required=True, 
            description='Token de restablecimiento recibido por email', 
            example='abc123def456ghi789jkl012'
        )
    })
    
    reset_password = api.model('ResetPassword', {
        'token': fields.String(
            required=True, 
            description='Token de restablecimiento válido', 
            example='abc123def456ghi789jkl012'
        ),
        'newPassword': fields.String(
            required=True, 
            description='Nueva contraseña (debe cumplir requisitos de seguridad)', 
            example='NewSecurePassword123'
        )
    })
    
    google_login_request = api.model('GoogleLoginRequest', {
        'token': fields.String(
            required=True,
            description='Google ID Token obtenido del frontend',
            example='eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjY2Vzc190b2tlbiJ9...'
        )
    })
    
    # Modelo para subida de archivos
    file_upload_response = api.model('FileUploadResponse', {
        'message': fields.String(description='Mensaje de confirmación'),
        'profile_picture': fields.String(description='URL de la imagen subida')
    })
    
    return {
        'base_response': base_response,
        'error_response': error_response,
        'user_registration': user_registration,
        'user_login': user_login,
        'user_info': user_info,
        'user_response': user_response,
        'profile_response': profile_response,
        'profile_update': profile_update,
        'profile_update_response': profile_update_response,
        'password_change': password_change,
        'forgot_password': forgot_password,
        'verify_token': verify_token,
        'reset_password': reset_password,
        'google_login_request': google_login_request,
        'file_upload_response': file_upload_response
    }
