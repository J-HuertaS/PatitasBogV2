"""
Controlador de autenticación que integra UserController y PasswordResetController
"""
from .user_controller import UserController
from .password_reset_controller import PasswordResetController
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from flask import current_app, jsonify
from models.user import User
import jwt
from datetime import datetime, timedelta
import bcrypt # For creating a dummy password if needed

class AuthController:
    """Controlador unificado para todas las operaciones de autenticación"""
    
    @staticmethod
    async def register(data):
        """
        Registrar nuevo usuario
        
        Args:
            data (dict): Datos de registro del usuario
            
        Returns:
            tuple: (response_data, status_code)
        """
        return await UserController.register_user(data)
    
    @staticmethod
    def login(data):
        """
        Iniciar sesión de usuario
        
        Args:
            data (dict): Credenciales de login
            
        Returns:
            tuple: (response_data, status_code)
        """
        return UserController.login_user(data)
    
    @staticmethod
    def forgot_password(data):
        """
        Solicitar restablecimiento de contraseña
        
        Args:
            data (dict): Datos con email del usuario
            
        Returns:
            tuple: (response_data, status_code)
        """
        return PasswordResetController.request_password_reset(data)
    
    @staticmethod
    def verify_reset_token(data):
        """
        Verificar token de restablecimiento
        
        Args:
            data (dict): Datos con token a verificar
            
        Returns:
            tuple: (response_data, status_code)
        """
        return PasswordResetController.verify_reset_token(data)
    
    @staticmethod
    def reset_password(data):
        """
        Restablecer contraseña con token válido
        
        Args:
            data (dict): Datos con token y nueva contraseña
            
        Returns:
            tuple: (response_data, status_code)
        """
        return PasswordResetController.reset_password(data)

    @staticmethod
    def google_login(data):
        """
        Handles Google Sign-In.
        Verifies the Google ID token, finds or creates a user, and returns a JWT.
        """
        try:
            token = data.get('token')
            if not token:
                return {'message': 'Google ID token is required'}, 400

            CLIENT_ID = current_app.config.get('GOOGLE_CLIENT_ID')
            if not CLIENT_ID:
                current_app.logger.error("GOOGLE_CLIENT_ID is not configured in the backend.")
                return {'message': 'Google Sign-In is not configured on the server.'}, 500

            try:
                # Verify the ID token
                idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), CLIENT_ID)
                
                # Extract user information
                user_email = idinfo.get('email')
                user_full_name = idinfo.get('name', user_email.split('@')[0]) # Use name, or part of email as fallback

                if not user_email:
                    return {'message': 'Email not found in Google token'}, 400

            except ValueError as e:
                # Invalid token
                current_app.logger.error(f"Invalid Google token: {str(e)}")
                return {'message': 'Invalid Google token'}, 401
            
            # Check if user exists
            user = User.find_by_email(user_email)
            
            if not user:
                # User does not exist, create a new one
                # For users signing up with Google, we might not have a password.
                # You can either:
                # 1. Generate a random secure password (and perhaps mark the user as 'passwordless' or 'google_auth_only')
                # 2. Prompt them to set a password later if they try to use password-based login.
                # For simplicity, we'll create them without a password or with a placeholder.
                # Let's create a placeholder hashed password (user won't use it directly)
                placeholder_password = bcrypt.hashpw(user_email.encode('utf-8') + current_app.config['SECRET_KEY'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                
                new_user = User(
                    full_name=user_full_name,
                    email=user_email,
                    password=placeholder_password # Store a hashed placeholder or None
                )
                try:
                    new_user.save()
                    user = new_user
                    current_app.logger.info(f"New user created via Google Sign-In: {user_email}")
                except ValueError as e: # Handles duplicate email if, somehow, a race condition occurred
                    current_app.logger.error(f"Error creating user via Google Sign-In (duplicate?): {str(e)}")
                    return {'message': str(e)}, 409
            
            # Generate JWT for the user
            secret_key = current_app.config['SECRET_KEY']
            payload = {
                'userId': str(user._id),
                'exp': datetime.utcnow() + timedelta(days=30) # Standard token expiration
            }
            app_token = jwt.encode(payload, secret_key, algorithm='HS256')
            
            current_app.logger.info(f"User {user_email} logged in via Google.")
            return {
                'token': app_token,
                'user': user.to_dict() 
            }, 200

        except Exception as e:
            current_app.logger.error(f"Error during Google login: {str(e)}")
            return {'message': 'An error occurred during Google login.', 'error': str(e)}, 500
