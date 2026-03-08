# 🐾 Mascotas App - Backend

![CI Tests](https://github.com/MascotasBogota/LogIn_backend/workflows/CI%20Tests/badge.svg)
![Python](https://img.shields.io/badge/python-3.9%2B-blue.svg)
![Flask](https://img.shields.io/badge/flask-3.0.0-green.svg)

Backend API para la aplicación de mascotas desarrollada con Flask y MongoDB.

## 🚀 Características

- **Autenticación JWT** - Sistema seguro de login/registro
- **Validación de cadenas** - Patrón Chain of Responsibility para validaciones
- **MongoDB Atlas** - Base de datos en la nube
- **Tests automatizados** - Suite completa de tests con pytest
- **CI/CD** - GitHub Actions para tests automáticos

## 📋 Requisitos

- Python 3.9+
- MongoDB Atlas (o MongoDB local)
- Git

## 🛠️ Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/MascotasBogota/LogIn_backend.git
cd LogIn_backend
```

2. **Crear entorno virtual:**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno:**
Crear archivo `.env` con:
```env
MONGO_URI=tu_cadena_de_conexion_mongodb_atlas
JWT_SECRET=tu_clave_secreta_super_segura
PORT=5000
FLASK_ENV=development
```

## 🧪 Testing

### Ejecutar todos los tests:
```bash
python -m pytest -v
```

### Ejecutar tests específicos:
```bash
python -m pytest tests/test_basic.py -v
python -m pytest tests/test_user_controller.py -v
```

### Tests con cobertura:
```bash
pip install pytest-cov
python -m pytest --cov=. --cov-report=html
```

## 🚀 Ejecutar la aplicación

```bash
python app.py
```

La API estará disponible en: `http://localhost:5000`

## 📡 Endpoints

### Rutas principales:
- `GET /` - Estado de la API
- `GET /api` - Test del endpoint API
- `GET /api/users/` - Test de rutas de usuarios

### Autenticación:
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Iniciar sesión

### Ejemplo de registro:
```json
POST /api/users/register
{
  "full_name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "MiPassword123"
}
```

### Ejemplo de login:
```json
POST /api/users/login
{
  "email": "juan@ejemplo.com",
  "password": "MiPassword123"
}
```

## 🏗️ Arquitectura

```
LogIn_backend/
├── app.py                 # Aplicación principal
├── config/               # Configuración de DB
├── controllers/          # Lógica de negocio
├── handlers/            # Validadores (Chain of Responsibility)
├── models/              # Modelos de datos
├── routes/              # Rutas de la API
├── services/            # Servicios y utilidades
├── tests/               # Tests automatizados
└── utils/               # Utilidades generales
```

## 🔄 CI/CD

Este proyecto incluye GitHub Actions que automáticamente:

- ✅ Ejecuta tests en Python 3.9, 3.10, y 3.11
- ✅ Verifica la calidad del código
- ✅ Genera reportes de cobertura
- ✅ Se ejecuta en cada push y pull request

## 🤝 Contribuir

1. Hacer fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

David Alejandro Cifuentes Gonzalez - [@dcifuentesg](https://github.com/dcifuentesg)
