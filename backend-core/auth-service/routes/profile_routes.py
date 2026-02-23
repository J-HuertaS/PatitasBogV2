"""
Rutas para gestión de perfil de usuario
"""
from flask import Blueprint, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import jwt
from functools import wraps
from controllers.profile_controller import ProfileController
import os

# Crear blueprint para rutas de perfil
profile_bp = Blueprint('profile', __name__)

# Configurar rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri="memory://",
    default_limits=["200 per day", "50 per hour"]
)

def token_required(f):
    """
    Decorador para verificar token JWT en las rutas protegidas
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # JWT se puede enviar en el header Authorization
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(" ")[1]  # "Bearer <token>"
            except IndexError:
                return jsonify({'message': 'Formato de token inválido'}), 401
        
        if not token:
            return jsonify({'message': 'Token requerido'}), 401
        
        try:
            # Decodificar token
            secret_key = os.getenv('JWT_SECRET', 'mascotas_secret_key')
            data = jwt.decode(token, secret_key, algorithms=['HS256'])
            current_user_id = data['userId']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token inválido'}), 401
        
        return f(current_user_id, *args, **kwargs)
    
    return decorated

@profile_bp.route('/', methods=['GET'])
@token_required
def get_profile(current_user_id):
    """
    Obtener información del perfil del usuario autenticado
    
    Headers:
        Authorization: Bearer <jwt_token>
    """
    try:
        # Llamar al controlador
        response_data, status_code = ProfileController.get_profile(current_user_id)
        return jsonify(response_data), status_code
        
    except Exception as e:
        return jsonify({
            'message': 'Error obteniendo perfil',
            'error': str(e)
        }), 500

@profile_bp.route('/', methods=['PUT'])
@token_required
def update_profile(current_user_id):
    """
    Actualizar información del perfil del usuario autenticado
    
    Headers:
        Authorization: Bearer <jwt_token>
    
    Expected JSON:
    {
        "full_name": "Nuevo Nombre",
        "email": "nuevo@email.com",
        "username": "nuevo_username",
        "profilePicture": "url_to_image",
        "gender": "male|female|other|prefer_not_to_say",
        "address": "Nueva dirección",
        "phoneNumber": "+1234567890"
    }
    
    Nota: Todos los campos son opcionales. Solo se actualizarán los campos enviados.
    """
    try:
        # Obtener datos JSON del request
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({'message': 'No se enviaron datos'}), 400
        
        # Llamar al controlador
        response_data, status_code = ProfileController.update_profile(current_user_id, request_data)
        return jsonify(response_data), status_code
        
    except Exception as e:
        return jsonify({
            'message': 'Error actualizando perfil',
            'error': str(e)
        }), 500

@profile_bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user_id):
    """
    Cambiar contraseña del usuario autenticado
    
    Headers:
        Authorization: Bearer <jwt_token>
    
    Expected JSON:
    {
        "currentPassword": "contraseña_actual",
        "newPassword": "nueva_contraseña"
    }
    """
    try:
        # Obtener datos JSON del request
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({'message': 'No se enviaron datos'}), 400
        
        # Llamar al controlador
        response_data, status_code = ProfileController.change_password(current_user_id, request_data)
        return jsonify(response_data), status_code
        
    except Exception as e:
        return jsonify({
            'message': 'Error cambiando contraseña',
            'error': str(e)
        }), 500

@profile_bp.route('/upload-picture', methods=['POST'])
@token_required
def upload_profile_picture(current_user_id):
    """
    Subir foto de perfil
    
    Headers:
        Authorization: Bearer <jwt_token>
    
    Form Data:
        file: imagen de perfil (png, jpg, jpeg, gif)
    """
    try:
        # Verificar que se envió un archivo
        if 'file' not in request.files:
            return jsonify({'message': 'No se envió ningún archivo'}), 400
        
        file = request.files['file']
        
        # Llamar al controlador para procesar el archivo
        response_data, status_code = ProfileController.upload_profile_picture(current_user_id, file)
        return jsonify(response_data), status_code
        
    except Exception as e:
        return jsonify({
            'message': 'Error subiendo foto de perfil',
            'error': str(e)
        }), 500
