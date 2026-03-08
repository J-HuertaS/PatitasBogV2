"""
Ejemplo de integración completa del sistema de gestión de perfil
Este archivo demuestra cómo usar todas las funcionalidades del perfil
"""
import requests
import json
from io import BytesIO
from PIL import Image

# Configuración
BASE_URL = "http://localhost:5000/api"
EMAIL = "usuario@ejemplo.com"
PASSWORD = "MiPassword123"

class ProfileIntegrationExample:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.user_id = None
    
    def register_user(self):
        """Paso 1: Registrar un nuevo usuario"""
        print("📝 Registrando nuevo usuario...")
        
        register_data = {
            "full_name": "Usuario de Prueba",
            "email": EMAIL,
            "password": PASSWORD
        }
        
        response = requests.post(f"{self.base_url}/users/register", json=register_data)
        
        if response.status_code == 201:
            print("✅ Usuario registrado exitosamente")
            return True
        else:
            print(f"❌ Error registrando usuario: {response.json()}")
            return False
    
    def login_user(self):
        """Paso 2: Hacer login y obtener token JWT"""
        print("🔐 Iniciando sesión...")
        
        login_data = {
            "email": EMAIL,
            "password": PASSWORD
        }
        
        response = requests.post(f"{self.base_url}/users/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            self.token = data['token']
            self.user_id = data['user']['id']
            print("✅ Login exitoso")
            print(f"🎫 Token obtenido: {self.token[:20]}...")
            return True
        else:
            print(f"❌ Error en login: {response.json()}")
            return False
    
    def get_headers(self):
        """Obtener headers con token de autorización"""
        return {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
    
    def get_profile(self):
        """Paso 3: Obtener información del perfil"""
        print("👤 Obteniendo perfil...")
        
        response = requests.get(
            f"{self.base_url}/profile/",
            headers=self.get_headers()
        )
        
        if response.status_code == 200:
            profile = response.json()['profile']
            print("✅ Perfil obtenido:")
            print(f"   📧 Email: {profile['email']}")
            print(f"   👤 Nombre: {profile['full_name']}")
            print(f"   🆔 ID: {profile['id']}")
            return profile
        else:
            print(f"❌ Error obteniendo perfil: {response.json()}")
            return None
    
    def update_profile(self):
        """Paso 4: Actualizar información del perfil"""
        print("✏️ Actualizando perfil...")
        
        update_data = {
            "username": "usuario_prueba",
            "gender": "masculino",
            "address": "Calle Falsa 123, Ciudad, País",
            "phoneNumber": "+1234567890"
        }
        
        response = requests.put(
            f"{self.base_url}/profile/",
            headers=self.get_headers(),
            json=update_data
        )
        
        if response.status_code == 200:
            print("✅ Perfil actualizado exitosamente")
            return True
        else:
            print(f"❌ Error actualizando perfil: {response.json()}")
            return False
    
    def change_password(self):
        """Paso 5: Cambiar contraseña"""
        print("🔑 Cambiando contraseña...")
        
        password_data = {
            "currentPassword": PASSWORD,
            "newPassword": "NuevaPassword456"
        }
        
        response = requests.post(
            f"{self.base_url}/profile/change-password",
            headers=self.get_headers(),
            json=password_data
        )
        
        if response.status_code == 200:
            print("✅ Contraseña cambiada exitosamente")
            return True
        else:
            print(f"❌ Error cambiando contraseña: {response.json()}")
            return False
    
    def create_test_image(self):
        """Crear una imagen de prueba para subir"""
        print("🖼️ Creando imagen de prueba...")
        
        # Crear imagen simple con PIL
        img = Image.new('RGB', (300, 300), color='lightblue')
        
        # Guardar en BytesIO
        img_bytes = BytesIO()
        img.save(img_bytes, format='JPEG', quality=85)
        img_bytes.seek(0)
        
        return img_bytes
    
    def upload_profile_picture(self):
        """Paso 6: Subir foto de perfil"""
        print("📤 Subiendo foto de perfil...")
        
        # Crear imagen de prueba
        test_image = self.create_test_image()
        
        # Preparar archivos para subida
        files = {
            'file': ('profile.jpg', test_image, 'image/jpeg')
        }
        
        # Headers sin Content-Type (requests lo maneja automáticamente para multipart)
        headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        response = requests.post(
            f"{self.base_url}/profile/upload-picture",
            headers=headers,
            files=files
        )
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Foto de perfil subida exitosamente")
            print(f"🖼️ URL de la imagen: {data['profile_picture']}")
            return True
        else:
            print(f"❌ Error subiendo foto: {response.json()}")
            return False
    
    def get_updated_profile(self):
        """Paso 7: Obtener perfil actualizado"""
        print("👤 Obteniendo perfil actualizado...")
        
        response = requests.get(
            f"{self.base_url}/profile/",
            headers=self.get_headers()
        )
        
        if response.status_code == 200:
            profile = response.json()['profile']
            print("✅ Perfil actualizado obtenido:")
            print(f"   📧 Email: {profile['email']}")
            print(f"   👤 Nombre: {profile['full_name']}")
            print(f"   🆔 Username: {profile.get('username', 'No establecido')}")
            print(f"   👫 Género: {profile.get('gender', 'No establecido')}")
            print(f"   🏠 Dirección: {profile.get('address', 'No establecida')}")
            print(f"   📱 Teléfono: {profile.get('phoneNumber', 'No establecido')}")
            print(f"   🖼️ Foto: {profile.get('profilePicture', 'No establecida')}")
            return profile
        else:
            print(f"❌ Error obteniendo perfil: {response.json()}")
            return None
    
    def run_complete_example(self):
        """Ejecutar ejemplo completo"""
        print("🚀 Iniciando ejemplo completo de gestión de perfil")
        print("=" * 60)
        
        # Ejecutar todos los pasos
        steps = [
            ("Registro", self.register_user),
            ("Login", self.login_user),
            ("Obtener perfil", self.get_profile),
            ("Actualizar perfil", self.update_profile),
            ("Cambiar contraseña", self.change_password),
            ("Subir foto", self.upload_profile_picture),
            ("Perfil final", self.get_updated_profile)
        ]
        
        for step_name, step_func in steps:
            print(f"\n📍 {step_name}")
            print("-" * 30)
            
            success = step_func()
            if not success and step_name in ["Registro", "Login"]:
                print("❌ Error crítico, deteniendo ejemplo")
                break
            
            print()
        
        print("=" * 60)
        print("✅ Ejemplo completado")

def main():
    """Función principal"""
    print("🐾 Ejemplo de Integración - Sistema de Gestión de Perfil")
    print("Mascotas App Backend API")
    print()
    
    # Crear instancia del ejemplo
    example = ProfileIntegrationExample()
    
    # Ejecutar ejemplo completo
    example.run_complete_example()
    
    print("\n📚 Para usar en tu aplicación:")
    print("1. Registra usuarios con POST /api/users/register")
    print("2. Haz login con POST /api/users/login para obtener JWT")
    print("3. Usa el token en header 'Authorization: Bearer <token>'")
    print("4. GET /api/profile/ - Obtener perfil")
    print("5. PUT /api/profile/ - Actualizar perfil")
    print("6. POST /api/profile/change-password - Cambiar contraseña")
    print("7. POST /api/profile/upload-picture - Subir foto (multipart/form-data)")

if __name__ == "__main__":
    # Verificar dependencias
    try:
        import requests
        import PIL
        main()
    except ImportError as e:
        print(f"❌ Dependencias faltantes: {e}")
        print("💡 Instala con: pip install requests Pillow")
