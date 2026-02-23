"""
Modelo de Usuario para MongoDB
"""
from datetime import datetime
from bson import ObjectId
from config.database import get_db
from pymongo.errors import DuplicateKeyError
import re

class User:
    """Modelo de Usuario"""
    def __init__(self, full_name=None, email=None, password=None, **kwargs):
        self.full_name = full_name
        self.email = email.lower() if email else None
        self.password = password
        # Nuevos campos para perfil completo
        self.username = kwargs.get('username', None)
        self.profile_picture = kwargs.get('profile_picture', None)
        self.gender = kwargs.get('gender', None)  # 'male', 'female', 'other', 'prefer_not_to_say'
        self.address = kwargs.get('address', None)
        self.phone_number = kwargs.get('phone_number', None)
        # Campos de auditoría
        self.created_at = kwargs.get('created_at', datetime.utcnow())
        self.updated_at = kwargs.get('updated_at', datetime.utcnow())
        self._id = kwargs.get('_id', None)
    
    @staticmethod
    def get_collection():
        """Obtener la colección de usuarios"""
        db = get_db()
        return db.users
    
    def save(self):
        """Guardar usuario en la base de datos"""
        collection = self.get_collection()
        # Crear índice único para email si no existe
        collection.create_index("email", unique=True)
        # Crear índice único para username si existe
        if self.username:
            collection.create_index("username", unique=True, sparse=True)
        
        user_data = {
            'full_name': self.full_name,
            'email': self.email,
            'password': self.password,
            'createdAt': self.created_at,
            'updatedAt': datetime.utcnow()
        }
        
        # Agregar campos opcionales solo si tienen valor
        if self.username:
            user_data['username'] = self.username
        if self.profile_picture:
            user_data['profilePicture'] = self.profile_picture
        if self.gender:
            user_data['gender'] = self.gender
        if self.address:
            user_data['address'] = self.address
        if self.phone_number:
            user_data['phoneNumber'] = self.phone_number
        
        try:
            if self._id:
                # Actualizar usuario existente
                result = collection.update_one(
                    {'_id': ObjectId(self._id)},
                    {'$set': user_data}
                )
                return self._id
            else:
                # Crear nuevo usuario
                result = collection.insert_one(user_data)
                self._id = result.inserted_id
                return self._id
                
        except DuplicateKeyError:
            raise ValueError('El correo ya está registrado')
    
    @staticmethod
    def find_by_email(email):
        """Buscar usuario por email"""
        collection = User.get_collection()
        user_data = collection.find_one({'email': email.lower()})
        
        if user_data:
            return User(
                full_name=user_data.get('full_name'), # Changed to .get()
                email=user_data.get('email'), # Also make email safe, though it should exist
                password=user_data.get('password'), # Also make password safe
                username=user_data.get('username'),
                profile_picture=user_data.get('profilePicture'),
                gender=user_data.get('gender'),
                address=user_data.get('address'),
                phone_number=user_data.get('phoneNumber'),
                created_at=user_data.get('createdAt'),
                updated_at=user_data.get('updatedAt'),
                _id=str(user_data['_id'])
            )
        return None
    
    @staticmethod
    def find_by_id(user_id):
        """Buscar usuario por ID"""
        collection = User.get_collection()
        user_data = collection.find_one({'_id': ObjectId(user_id)})
        
        if user_data:
            return User(
                full_name=user_data.get('full_name'), # Changed to .get()
                email=user_data.get('email'),
                password=user_data.get('password'),
                username=user_data.get('username'),
                profile_picture=user_data.get('profilePicture'),
                gender=user_data.get('gender'),
                address=user_data.get('address'),
                phone_number=user_data.get('phoneNumber'),
                created_at=user_data.get('createdAt'),
                updated_at=user_data.get('updatedAt'),
                _id=str(user_data['_id'])
            )
        return None
    
    def to_dict(self, include_password=False):
        """Convertir usuario a diccionario para respuesta JSON"""
        user_dict = {
            '_id': str(self._id),
            'full_name': self.full_name,
            'email': self.email,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }
        
        # Agregar campos opcionales solo si tienen valor
        if self.username:
            user_dict['username'] = self.username
        if self.profile_picture:
            user_dict['profilePicture'] = self.profile_picture
        if self.gender:
            user_dict['gender'] = self.gender
        if self.address:
            user_dict['address'] = self.address
        if self.phone_number:
            user_dict['phoneNumber'] = self.phone_number
        
        if include_password:
            user_dict['password'] = self.password
            
        return user_dict
    
    @staticmethod
    def validate_email(email):
        """Validar formato de email"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_username(username):
        """Validar formato de username"""
        if not username:
            return True  # Username es opcional
        
        # Username debe tener entre 3 y 20 caracteres, solo letras, números y guiones bajos
        pattern = r'^[a-zA-Z0-9_]{3,20}$'
        return re.match(pattern, username) is not None
    
    @staticmethod
    def validate_phone_number(phone_number):
        """Validar formato de número de teléfono"""
        if not phone_number:
            return True  # Teléfono es opcional
        
        # Permitir números con o sin espacios, guiones y paréntesis, mínimo 7 dígitos
        pattern = r'^[\+]?[\d\s\-\(\)]{7,20}$'
        return re.match(pattern, phone_number) is not None
    
    @staticmethod
    def validate_gender(gender):
        """Validar opción de género"""
        if not gender:
            return True  # Género es opcional
        
        valid_genders = ['male', 'female', 'other', 'prefer_not_to_say']
        return gender.lower() in valid_genders
    
    @staticmethod
    def validate_address(address):
        """Validar dirección"""
        if not address:
            return True  # Dirección es opcional
        
        # Dirección debe tener entre 5 y 200 caracteres
        return 5 <= len(address.strip()) <= 200
    
    @staticmethod
    def find_by_username(username):
        """Buscar usuario por username"""
        if not username:
            return None
            
        collection = User.get_collection()
        user_data = collection.find_one({'username': username})
        
        if user_data:
            return User(
                full_name=user_data.get('full_name'), # Changed to .get()
                email=user_data.get('email'),
                password=user_data.get('password'),
                username=user_data.get('username'),
                profile_picture=user_data.get('profilePicture'),
                gender=user_data.get('gender'),
                address=user_data.get('address'),
                phone_number=user_data.get('phoneNumber'),
                created_at=user_data.get('createdAt'),
                updated_at=user_data.get('updatedAt'),
                _id=str(user_data['_id'])
            )
        return None
