"""
Rutas para manejo de usuarios
"""
from flask import Blueprint, request, jsonify
import asyncio
from controllers.user_controller import UserController

# Crear blueprint para rutas de usuario
user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['GET'])
def test_users_route():
    """Ruta de prueba para users"""
    return jsonify({'message': 'User routes working'})

@user_bp.route('/register', methods=['POST'])
def register():
    """Registrar un nuevo usuario"""
    try:
        # Obtener datos JSON del request
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({'message': 'No se enviaron datos'}), 400
        
        # Llamar al controlador (de forma asíncrona)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            response_data, status_code = loop.run_until_complete(
                UserController.register_user(request_data)
            )
            return jsonify(response_data), status_code
        finally:
            loop.close()
            
    except Exception as e:
        return jsonify({
            'message': 'Error procesando registro',
            'error': str(e)
        }), 500

@user_bp.route('/login', methods=['POST'])
def login():
    """Iniciar sesión de usuario"""
    try:
        # Obtener datos JSON del request
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({'message': 'No se enviaron datos'}), 400
        
        # Llamar al controlador
        response_data, status_code = UserController.login_user(request_data)
        return jsonify(response_data), status_code
        
    except Exception as e:
        return jsonify({
            'message': 'Error procesando login',
            'error': str(e)
        }), 500
