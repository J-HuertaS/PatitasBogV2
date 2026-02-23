"""
API Swagger para endpoints de autenticación
"""
import asyncio
from flask import request, current_app
from flask_restx import Namespace, Resource

from controllers.auth_controller import AuthController
from .swagger_models import create_swagger_models

# Crear namespace para autenticación
auth_ns = Namespace('auth', description='Autenticación y gestión de usuarios', path='/api/auth')

def register_auth_api(api):
    """Registrar todos los endpoints de autenticación con documentación Swagger"""
    
    # Crear modelos Swagger
    models = create_swagger_models(api)
    
    # Crear controlador
    auth_controller = AuthController()
    
    @auth_ns.route('/register')
    class RegisterResource(Resource):
        @auth_ns.doc(
            'register_user',
            description='Registrar nuevo usuario en el sistema',
            responses={
                201: ('Usuario registrado exitosamente', models['user_response']),
                400: ('Datos de entrada inválidos', models['error_response']),
                409: ('Email ya existe', models['error_response'])
            }
        )
        @auth_ns.expect(models['user_registration'], validate=True)
        @auth_ns.marshal_with(models['user_response'], code=201)
        def post(self):
            """Registrar nuevo usuario"""
            try:
                data = request.get_json()
                # Ejecutar función async en un loop
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                try:
                    result = loop.run_until_complete(auth_controller.register(data))
                    return result
                finally:
                    loop.close()
            except Exception as e:
                current_app.logger.error(f"Error registering user: {str(e)}")
                return {'message': 'Error interno del servidor'}, 500
    
    @auth_ns.route('/login')
    class LoginResource(Resource):
        @auth_ns.doc(
            'login_user',
            description='Iniciar sesión con email y contraseña',
            responses={
                200: ('Login exitoso', models['user_response']),
                400: ('Datos de entrada inválidos', models['error_response']),
                401: ('Credenciales incorrectas', models['error_response']),
                404: ('Usuario no encontrado', models['error_response'])
            }
        )
        @auth_ns.expect(models['user_login'], validate=True)
        @auth_ns.marshal_with(models['user_response'], code=200)
        def post(self):
            """Iniciar sesión de usuario"""
            try:
                data = request.get_json()
                return auth_controller.login(data)
            except Exception as e:
                current_app.logger.error(f"Error logging in user: {str(e)}")
                return {'message': 'Error interno del servidor'}, 500
    
    @auth_ns.route('/forgot-password')
    class ForgotPasswordResource(Resource):
        @auth_ns.doc(
            'forgot_password',
            description='Solicitar restablecimiento de contraseña por email',
            responses={
                200: ('Email de restablecimiento enviado', models['base_response']),
                400: ('Email inválido', models['error_response']),
                404: ('Usuario no encontrado', models['error_response'])
            }
        )
        @auth_ns.expect(models['forgot_password'], validate=True)
        @auth_ns.marshal_with(models['base_response'], code=200)
        def post(self):
            """Solicitar restablecimiento de contraseña"""
            try:
                data = request.get_json()
                return auth_controller.forgot_password(data)
            except Exception as e:
                current_app.logger.error(f"Error in forgot password: {str(e)}")
                return {'message': 'Error interno del servidor'}, 500
    
    @auth_ns.route('/verify-token')
    class VerifyTokenResource(Resource):
        @auth_ns.doc(
            'verify_reset_token',
            description='Verificar validez del token de restablecimiento',
            responses={
                200: ('Token válido', models['base_response']),
                400: ('Token inválido o expirado', models['error_response'])
            }
        )
        @auth_ns.expect(models['verify_token'], validate=True)
        @auth_ns.marshal_with(models['base_response'], code=200)
        def post(self):
            """Verificar token de restablecimiento"""
            try:
                data = request.get_json()
                return auth_controller.verify_reset_token(data)
            except Exception as e:
                current_app.logger.error(f"Error verifying token: {str(e)}")
                return {'message': 'Error interno del servidor'}, 500
    
    @auth_ns.route('/reset-password')
    class ResetPasswordResource(Resource):
        @auth_ns.doc(
            'reset_password',
            description='Restablecer contraseña con token válido',
            responses={
                200: ('Contraseña restablecida exitosamente', models['base_response']),
                400: ('Token inválido o contraseña débil', models['error_response']),
                404: ('Usuario no encontrado', models['error_response'])
            }
        )
        @auth_ns.expect(models['reset_password'], validate=True)
        @auth_ns.marshal_with(models['base_response'], code=200)
        def post(self):
            """Restablecer contraseña"""
            try:
                data = request.get_json()
                return auth_controller.reset_password(data)
            except Exception as e:
                current_app.logger.error(f"Error resetting password: {str(e)}")
                return {'message': 'Error interno del servidor'}, 500

    @auth_ns.route('/google_login') # New route for Google Sign-In
    class GoogleLoginResource(Resource):
        @auth_ns.doc(
            'google_login',
            description='Iniciar sesión o registrarse con Google ID Token.',
            responses={
                200: ('Login/Registro con Google exitoso', models['user_response']),
                400: ('Token de Google ID es requerido o inválido', models['error_response']),
                401: ('Token de Google inválido o expirado', models['error_response']),
                500: ('Error interno del servidor / Google Sign-In no configurado', models['error_response'])
            }
        )
        @auth_ns.expect(models['google_login_request'], validate=True)
        @auth_ns.marshal_with(models['user_response'], code=200)
        def post(self):
            """Manejar el login/registro con Google"""
            try:
                data = request.get_json()
                return auth_controller.google_login(data)
            except Exception as e:
                current_app.logger.error(f"Error in Google login endpoint: {str(e)}")
                return {'message': 'Error interno del servidor durante el login con Google'}, 500
    
    # Registrar namespace
    api.add_namespace(auth_ns)
