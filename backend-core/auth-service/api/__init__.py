"""
Inicialización del paquete API con Swagger
"""
from flask_restx import Api

def create_api(app):
    """
    Crear y configurar la API con documentación Swagger
    """
    from .auth_api import register_auth_api
    from .profile_api import register_profile_api
    api = Api(
        app,
        version='1.0',
        title='Sistema de Gestión de Perfiles API',
        description='''
        **API RESTful completa para gestión de usuarios y perfiles**
        
        ## Características principales:
        - ✅ **Autenticación JWT**: Registro, login y restablecimiento de contraseñas
        - ✅ **Gestión de Perfiles**: CRUD completo de información personal
        - ✅ **Subida de Archivos**: Upload de fotos de perfil con validación
        - ✅ **Seguridad**: Validación de datos, encriptación de contraseñas
        - ✅ **Auditoría**: Logging completo de operaciones
        - ✅ **Documentación**: Swagger UI interactivo
        
        ## Autenticación:
        Para endpoints protegidos, incluye el header:
        ```
        Authorization: Bearer <tu_jwt_token>
        ```
        
        ## Formatos soportados:
        - **JSON**: Para todas las operaciones CRUD
        - **Multipart/form-data**: Para subida de archivos
        
        ## Códigos de respuesta:
        - **200**: Operación exitosa
        - **201**: Recurso creado
        - **400**: Error de validación
        - **401**: No autorizado
        - **404**: Recurso no encontrado
        - **409**: Conflicto (ej: email duplicado)
        - **413**: Archivo muy grande
        - **500**: Error interno del servidor
        ''',
        doc='/api/docs/',  # URL para Swagger UI
        prefix='/api',
        authorizations={
            'Bearer': {
                'type': 'apiKey',
                'in': 'header',
                'name': 'Authorization',
                'description': 'Agregar Bearer token. Formato: Bearer <token>'
            }
        },
        security='Bearer',
        validate=True,
        ordered=True
    )
    
    # Registrar namespaces
    register_auth_api(api)
    register_profile_api(api)
    
    return api
