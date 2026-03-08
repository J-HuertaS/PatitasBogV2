#!/usr/bin/env python
"""
Script para iniciar la aplicación Flask con Swagger
"""
import webbrowser
import time
from app import create_app
import os

def main():
    """Iniciar la aplicación Flask con documentación Swagger"""
    
    print("🚀 Iniciando Sistema de Gestión de Perfiles con Swagger...")
    print("=" * 60)
    
    # Crear aplicación
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    
    # Mostrar información importante
    print(f"📡 Servidor: http://localhost:{port}")
    print(f"📚 Swagger UI: http://localhost:{port}/api/docs/")
    print(f"📋 API Schema: http://localhost:{port}/api/swagger.json")
    print(f"🔗 API Base: http://localhost:{port}/api")
    print("=" * 60)
    print("🎯 Para usar endpoints protegidos:")
    print("   1. Registra/Loguea en /api/auth/register o /api/auth/login")
    print("   2. Copia el token de la respuesta")
    print("   3. En Swagger UI, haz clic en 'Authorize'")
    print("   4. Ingresa: Bearer <tu_token>")
    print("=" * 60)
    print("🔧 Endpoints disponibles:")
    print("   AUTH: /api/auth/register, /api/auth/login, /api/auth/forgot-password")
    print("   PROFILE: /api/profile/, /api/profile/password, /api/profile/upload-picture")
    print("=" * 60)
    print("✨ ¡Swagger UI está listo! Abriendo en el navegador...")
    
    # Abrir Swagger UI en el navegador después de 2 segundos
    def open_browser():
        time.sleep(2)
        try:
            webbrowser.open(f'http://localhost:{port}/api/docs/')
        except:
            pass
    
    import threading
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Iniciar servidor
    print(f"🌟 Servidor ejecutándose en puerto {port}...")
    print("👆 Presiona Ctrl+C para detener")
    print("=" * 60)
    
    try:
        app.run(host='0.0.0.0', port=port, debug=True)
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido por el usuario")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == '__main__':
    main()
