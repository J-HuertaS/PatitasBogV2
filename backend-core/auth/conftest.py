"""
Configuración específica para tests en GitHub Actions
"""
import os
import sys

# Variables de entorno para testing
os.environ['MONGO_URI'] = 'mongodb://localhost:27017/test-db'
os.environ['JWT_SECRET'] = 'test-secret-key-for-github-actions'
os.environ['FLASK_ENV'] = 'testing'

# Asegurar que los imports funcionen
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
