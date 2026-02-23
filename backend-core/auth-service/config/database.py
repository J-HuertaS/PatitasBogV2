"""
Configuración de conexión a MongoDB
"""
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os

# Variable global para la base de datos
db = None

def init_db(app=None):
    """Inicializar conexión a MongoDB"""
    global db
    
    try:
        # Obtener URI de MongoDB desde variables de entorno
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/mascotas-app')
        
        # Log de conexión (sin mostrar contraseña)
        uri_safe = mongo_uri.replace(r':([^:@]+)@', ':***@') if ':' in mongo_uri else mongo_uri
        print(f'🔗 Conectando a MongoDB: {uri_safe}')
        
        # Crear cliente de MongoDB
        client = MongoClient(mongo_uri)
        
        # Probar la conexión
        client.admin.command('ping')
        
        # Obtener la base de datos
        db_name = 'mascotas-app'
        db = client[db_name]
        
        print(f'✅ MongoDB Connected: {client.address}')
        print(f'📊 Database: {db_name}')
        
        return db
        
    except ConnectionFailure as e:
        print(f'❌ Error connecting to MongoDB: {e}')
        if 'authentication' in str(e).lower():
            print('   🔑 Verifica tu usuario y contraseña en MongoDB Atlas')
        if 'network' in str(e).lower():
            print('   🌐 Verifica tu conexión a internet')
        raise e
    except Exception as e:
        print(f'❌ Unexpected error: {e}')
        raise e

def get_db():
    """Obtener instancia de la base de datos"""
    global db
    if db is None:
        raise Exception('Database not initialized. Call init_db() first.')
    return db
