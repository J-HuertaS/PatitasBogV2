"""
Script para probar la conexión y creación de tablas en PostgreSQL/Supabase usando SQLAlchemy.
"""
from config.database import init_db

if __name__ == "__main__":
    print("Iniciando prueba de conexión y creación de tablas...")
    init_db()
    print("¡Conexión exitosa y tablas listas!")
