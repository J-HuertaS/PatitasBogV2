"""
API Swagger para endpoints de perfil de usuario
"""
import os
import jwt
from flask import request, current_app
from flask_restx import Namespace, Resource
from werkzeug.datastructures import FileStorage
from functools import wraps

from controllers.profile_controller import ProfileController
from .swagger_models import create_swagger_models

# Crear namespace para perfil
profile_ns = Namespace('profile', description='Gestión de perfil de usuario', path='/api/profile')

def swagger_jwt_required(f):
    """Decorador JWT personalizado para Swagger"""
    @wraps(f)
    def decorated(self, *args, **kwargs):
        token = None
        
        # JWT se puede enviar en el header Authorization
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(" ")[1]  # "Bearer <token>"
            except IndexError:
                return {'message': 'Formato de token inválido'}, 401
        
        if not token:
            return {'message': 'Token requerido'}, 401
        
        try:
            # Decodificar token
            secret_key = os.getenv('JWT_SECRET', 'mascotas_secret_key')
            data = jwt.decode(token, secret_key, algorithms=['HS256'])
            current_user_id = data['userId']
        except jwt.ExpiredSignatureError:
            return {'message': 'Token expirado'}, 401
        except jwt.InvalidTokenError:
            return {'message': 'Token inválido'}, 401
        
        return f(self, current_user_id, *args, **kwargs)
    
    return decorated

def register_profile_api(api):
    """Registrar todos los endpoints de perfil con documentación Swagger"""
    
    # Crear modelos Swagger
    models = create_swagger_models(api)
    
    # Parser para subida de archivos
    upload_parser = api.parser()
    upload_parser.add_argument('file', location='files', type=FileStorage, required=True,
                              help='Archivo de imagen para foto de perfil (JPG, PNG, GIF)')
    
    # Crear controlador
    profile_controller = ProfileController()
    
    @profile_ns.route('/')
    class ProfileResource(Resource):
        @profile_ns.doc(
            'get_profile',
            description='Obtener información del perfil del usuario autenticado',
            security='Bearer',
            responses={
                200: ('Perfil obtenido exitosamente', models['profile_response']),
                401: ('Token inválido o expirado', models['error_response']),
                404: ('Usuario no encontrado', models['error_response'])
            }
        )
        @profile_ns.marshal_with(models['profile_response'], code=200)
        @swagger_jwt_required
        def get(self, current_user_id):
            """Obtener perfil del usuario autenticado"""
            try:
                return profile_controller.get_profile(current_user_id)
            except Exception as e:
                current_app.logger.error(f"Error getting profile: {str(e)}")
                return {'message': 'Error interno del servidor'}, 500
        
        @profile_ns.doc(
            'update_profile',
            description='Actualizar información del perfil del usuario',
            security='Bearer',
            responses={
                200: ('Perfil actualizado exitosamente', models['profile_update_response']),
                400: ('Datos de entrada inválidos', models['error_response']),
                401: ('Token inválido o expirado', models['error_response']),
                404: ('Usuario no encontrado', models['error_response']),
                409: ('Email ya existe', models['error_response'])
            }
        )
        @profile_ns.expect(models['profile_update'], validate=True)
        @profile_ns.marshal_with(models['profile_update_response'], code=200)
        @swagger_jwt_required
        def put(self, current_user_id):
            """Actualizar perfil del usuario autenticado"""
            try:
                data = request.get_json()
                return profile_controller.update_profile(current_user_id, data)
            except Exception as e:
                current_app.logger.error(f"Error updating profile: {str(e)}")
                return {'message': 'Error interno del servidor'}, 500
    
    @profile_ns.route('/password')
    class PasswordResource(Resource):
        @profile_ns.doc(
            'change_password',
            description='Cambiar contraseña del usuario autenticado',
            security='Bearer',
            responses={
                200: ('Contraseña cambiada exitosamente', models['base_response']),
                400: ('Contraseña actual incorrecta o nueva contraseña débil', models['error_response']),
                401: ('Token inválido o expirado', models['error_response']),
                404: ('Usuario no encontrado', models['error_response'])
            }
        )
        @profile_ns.expect(models['password_change'], validate=True)
        @profile_ns.marshal_with(models['base_response'], code=200)
        @swagger_jwt_required
        def put(self, current_user_id):
            """Cambiar contraseña del usuario autenticado"""
            try:
                data = request.get_json()
                return profile_controller.change_password(current_user_id, data)
            except Exception as e:
                current_app.logger.error(f"Error changing password: {str(e)}")
                return {'message': 'Error interno del servidor'}, 500
    
    @profile_ns.route('/upload-picture')
    class ProfilePictureResource(Resource):
        @profile_ns.doc(
            'upload_profile_picture',
            description='Subir o actualizar foto de perfil del usuario',
            security='Bearer',
            responses={
                200: ('Imagen subida exitosamente', models['file_upload_response']),
                400: ('Archivo no válido o formato incorrecto', models['error_response']),
                401: ('Token inválido o expirado', models['error_response']),
                413: ('Archivo demasiado grande (máx. 5MB)', models['error_response'])
            }
        )
        @profile_ns.expect(upload_parser)
        @profile_ns.marshal_with(models['file_upload_response'], code=200)
        @swagger_jwt_required
        def post(self, current_user_id):
            """Subir foto de perfil del usuario autenticado"""
            try:
                if 'file' not in request.files:
                    return {'message': 'No se encontró archivo en la solicitud'}, 400
                
                file = request.files['file']
                return profile_controller.upload_profile_picture(current_user_id, file)
            except Exception as e:
                current_app.logger.error(f"Error uploading profile picture: {str(e)}")
                return {'message': 'Error interno del servidor'}, 500
    
    # Registrar namespace
    api.add_namespace(profile_ns)
