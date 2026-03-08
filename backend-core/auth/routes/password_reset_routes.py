"""
Rutas para restablecimiento de contraseñas
"""
from flask import Blueprint, request, jsonify
from controllers.password_reset_controller import PasswordResetController

# Crear blueprint para rutas de password reset
password_reset_bp = Blueprint('password_reset', __name__)

@password_reset_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Solicitar restablecimiento de contraseña
    
    Expected JSON:
    {
        "email": "usuario@ejemplo.com"
    }
    """
    try:
        # Obtener datos JSON del request
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({'message': 'No se enviaron datos'}), 400
        
        # Llamar al controlador
        response_data, status_code = PasswordResetController.request_password_reset(request_data)
        return jsonify(response_data), status_code
        
    except Exception as e:
        return jsonify({
            'message': 'Error procesando solicitud de restablecimiento',
            'error': str(e)
        }), 500

@password_reset_bp.route('/verify-token', methods=['POST'])
def verify_token():
    """
    Verificar validez de token de restablecimiento
    
    Expected JSON:
    {
        "token": "abc123..."
    }
    """
    try:
        # Obtener datos JSON del request
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({'message': 'No se enviaron datos'}), 400
        
        # Llamar al controlador
        response_data, status_code = PasswordResetController.verify_reset_token(request_data)
        return jsonify(response_data), status_code
        
    except Exception as e:
        return jsonify({
            'message': 'Error verificando token',
            'error': str(e)
        }), 500

@password_reset_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Restablecer contraseña con token válido
    
    Expected JSON:
    {
        "token": "abc123...",
        "password": "NuevaPassword123"
    }
    """
    try:
        # Obtener datos JSON del request
        request_data = request.get_json()
        
        if not request_data:
            return jsonify({'message': 'No se enviaron datos'}), 400
        
        # Llamar al controlador
        response_data, status_code = PasswordResetController.reset_password(request_data)
        return jsonify(response_data), status_code
        
    except Exception as e:
        return jsonify({
            'message': 'Error restableciendo contraseña',
            'error': str(e)
        }), 500
