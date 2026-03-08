# 📋 Guía de Integración Frontend - Sistema de Gestión de Perfil

**Mascotas App Backend API v1.0**  
*Guía completa para desarrolladores frontend*

---

## 📖 Índice

1. [Introducción](#introducción)
2. [Configuración Inicial](#configuración-inicial)
3. [Autenticación JWT](#autenticación-jwt)
4. [Endpoints Disponibles](#endpoints-disponibles)
5. [Gestión de Perfil](#gestión-de-perfil)
6. [Subida de Archivos](#subida-de-archivos)
7. [Manejo de Errores](#manejo-de-errores)
8. [Ejemplos de Implementación](#ejemplos-de-implementación)
9. [Tipos de Datos](#tipos-de-datos)
10. [Mejores Prácticas](#mejores-prácticas)

---

## 🚀 Introducción

Este backend proporciona un sistema completo de gestión de perfiles de usuario con las siguientes funcionalidades:

### ✨ Características Principales
- 🔐 **Autenticación JWT** segura
- 👤 **Gestión completa de perfiles** de usuario
- 📤 **Subida de imágenes** de perfil
- 🔑 **Cambio de contraseñas** con validación
- ✅ **Validación robusta** de datos
- 📊 **Auditoría** de cambios
- 🔒 **Seguridad** enterprise-grade

---

## ⚙️ Configuración Inicial

### Base URL
```
http://localhost:5000/api
```

### Headers Requeridos
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <jwt_token>' // Para rutas protegidas
}
```

### CORS
El backend está configurado para aceptar requests desde:
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (React/Next.js)

---

## 🔐 Autenticación JWT

### Flujo de Autenticación

1. **Login del usuario** → Obtener JWT token
2. **Incluir token** en header `Authorization`
3. **Token expira** → Renovar o reloguear

### Ejemplo de Login
```javascript
// POST /api/users/login
const loginUser = async (email, password) => {
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Guardar token para futuras requests
      localStorage.setItem('authToken', data.token);
      return data.user;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};
```

---

## 📡 Endpoints Disponibles

### 🔓 Endpoints Públicos

#### Registro de Usuario
```http
POST /api/users/register
```
**Body:**
```json
{
  "full_name": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "MiPassword123"
}
```

#### Login
```http
POST /api/users/login
```
**Body:**
```json
{
  "email": "juan@ejemplo.com",
  "password": "MiPassword123"
}
```

### 🔒 Endpoints Protegidos (Requieren JWT)

#### Obtener Perfil
```http
GET /api/profile/
Headers: Authorization: Bearer <token>
```

#### Actualizar Perfil
```http
PUT /api/profile/
Headers: Authorization: Bearer <token>
```

#### Cambiar Contraseña
```http
POST /api/profile/change-password
Headers: Authorization: Bearer <token>
```

#### Subir Foto de Perfil
```http
POST /api/profile/upload-picture
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
```

---

## 👤 Gestión de Perfil

### Obtener Perfil del Usuario

```javascript
const getProfile = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/profile/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data.profile;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    throw error;
  }
};
```

**Respuesta Exitosa:**
```json
{
  "message": "Perfil obtenido exitosamente",
  "profile": {
    "id": "user_id_123",
    "full_name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "username": "juanperez",
    "profilePicture": "/static/uploads/profile_pictures/user_123_abc123.jpg",
    "gender": "masculino",
    "address": "Calle Falsa 123, Ciudad",
    "phoneNumber": "+1234567890",
    "hasPassword": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-06-10T18:45:00Z"
  }
}
```

### Actualizar Información del Perfil

```javascript
const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/profile/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data.profile;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    throw error;
  }
};

// Ejemplo de uso
updateProfile({
  full_name: "Juan Carlos Pérez",
  username: "juancperez",
  gender: "masculino",
  address: "Nueva Dirección 456",
  phoneNumber: "+9876543210"
});
```

### Cambiar Contraseña

```javascript
const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('/api/profile/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    throw error;
  }
};
```

---

## 📤 Subida de Archivos

### Subir Foto de Perfil

```javascript
const uploadProfilePicture = async (file) => {
  try {
    const token = localStorage.getItem('authToken');
    
    // Crear FormData para envío multipart
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/profile/upload-picture', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // NO incluir Content-Type, el browser lo maneja automáticamente
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return data.profile_picture; // URL de la nueva imagen
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw error;
  }
};

// Ejemplo de uso con input file
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  
  if (file) {
    // Validar archivo antes de subir
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('La imagen es muy grande. Máximo 5MB');
      return;
    }
    
    try {
      const imageUrl = await uploadProfilePicture(file);
      console.log('Imagen subida:', imageUrl);
      // Actualizar UI con la nueva imagen
    } catch (error) {
      alert('Error subiendo imagen: ' + error.message);
    }
  }
};
```

### Validaciones de Archivos

**Formatos Permitidos:**
- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)
- GIF (`.gif`)

**Restricciones:**
- Tamaño máximo: **5MB**
- Se redimensionan automáticamente si son muy grandes (máx. 800x800px)
- Se optimizan para web (JPEG quality 85%)

---

## ❌ Manejo de Errores

### Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| `200` | OK | Operación exitosa |
| `201` | Created | Recurso creado exitosamente |
| `400` | Bad Request | Datos inválidos o faltantes |
| `401` | Unauthorized | Token JWT inválido o faltante |
| `404` | Not Found | Recurso no encontrado |
| `500` | Internal Server Error | Error interno del servidor |

### Estructura de Errores

```json
{
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

### Manejo de Errores en Frontend

```javascript
const handleApiError = (response, data) => {
  switch (response.status) {
    case 401:
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      break;
    case 400:
      // Mostrar mensaje de validación al usuario
      showValidationError(data.message);
      break;
    case 404:
      // Recurso no encontrado
      showNotFoundError();
      break;
    case 500:
      // Error interno del servidor
      showGenericError('Error interno del servidor');
      break;
    default:
      showGenericError(data.message || 'Error desconocido');
  }
};
```

---

## 🔧 Ejemplos de Implementación

### Componente React - Perfil de Usuario

```jsx
import React, { useState, useEffect } from 'react';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getProfile();
      setProfile(profileData);
      setFormData(profileData);
    } catch (error) {
      console.error('Error cargando perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      alert('Error actualizando perfil: ' + error.message);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadProfilePicture(file);
        setProfile(prev => ({ ...prev, profilePicture: imageUrl }));
        alert('Imagen actualizada exitosamente');
      } catch (error) {
        alert('Error subiendo imagen: ' + error.message);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="profile-container">
      <div className="profile-picture">
        <img 
          src={profile?.profilePicture || '/default-avatar.png'} 
          alt="Foto de perfil"
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload}
        />
      </div>

      {isEditing ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <input
            type="text"
            value={formData.full_name || ''}
            onChange={(e) => setFormData(prev => ({...prev, full_name: e.target.value}))}
            placeholder="Nombre completo"
          />
          <input
            type="text"
            value={formData.username || ''}
            onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
            placeholder="Nombre de usuario"
          />
          <select
            value={formData.gender || ''}
            onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
          >
            <option value="">Seleccionar género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
            <option value="prefiero_no_decir">Prefiero no decir</option>
          </select>
          <textarea
            value={formData.address || ''}
            onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
            placeholder="Dirección"
          />
          <input
            type="tel"
            value={formData.phoneNumber || ''}
            onChange={(e) => setFormData(prev => ({...prev, phoneNumber: e.target.value}))}
            placeholder="Número de teléfono"
          />
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
        </form>
      ) : (
        <div className="profile-info">
          <h2>{profile?.full_name}</h2>
          <p>@{profile?.username}</p>
          <p>{profile?.email}</p>
          <p>{profile?.gender}</p>
          <p>{profile?.address}</p>
          <p>{profile?.phoneNumber}</p>
          <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
```

### Componente Vue.js - Cambio de Contraseña

```vue
<template>
  <div class="password-change">
    <h3>Cambiar Contraseña</h3>
    <form @submit.prevent="changePassword">
      <div class="form-group">
        <label>Contraseña Actual:</label>
        <input 
          type="password" 
          v-model="form.currentPassword" 
          required
        />
      </div>
      
      <div class="form-group">
        <label>Nueva Contraseña:</label>
        <input 
          type="password" 
          v-model="form.newPassword" 
          required
          minlength="6"
        />
        <small>Debe contener al menos una mayúscula, minúscula y número</small>
      </div>
      
      <div class="form-group">
        <label>Confirmar Nueva Contraseña:</label>
        <input 
          type="password" 
          v-model="form.confirmPassword" 
          required
        />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Cambiando...' : 'Cambiar Contraseña' }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      loading: false
    }
  },
  methods: {
    async changePassword() {
      if (this.form.newPassword !== this.form.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      try {
        this.loading = true;
        await changePassword(this.form.currentPassword, this.form.newPassword);
        alert('Contraseña cambiada exitosamente');
        this.resetForm();
      } catch (error) {
        alert('Error: ' + error.message);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  }
}
</script>
```

---

## 📊 Tipos de Datos

### Objeto Usuario (Profile)

```typescript
interface UserProfile {
  id: string;                    // ID único del usuario
  full_name: string;              // Nombre completo (requerido)
  email: string;                 // Email único (requerido)
  username?: string;             // Nombre de usuario único (opcional)
  profilePicture?: string;       // URL de la imagen de perfil
  gender?: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';
  address?: string;              // Dirección (5-200 caracteres)
  phoneNumber?: string;          // Número de teléfono
  hasPassword: boolean;          // Indica si tiene contraseña establecida
  createdAt: string;             // Fecha de creación (ISO string)
  updatedAt: string;             // Última actualización (ISO string)
}
```

### Validaciones de Campos

| Campo | Tipo | Requerido | Validaciones |
|-------|------|-----------|--------------|
| `full_name` | string | ✅ | Mínimo 2 caracteres |
| `email` | string | ✅ | Formato válido, único |
| `username` | string | ❌ | 3-20 caracteres, alfanumérico + _, único |
| `profilePicture` | string | ❌ | URL válida |
| `gender` | enum | ❌ | Valores: masculino, femenino, otro, prefiero_no_decir |
| `address` | string | ❌ | 5-200 caracteres |
| `phoneNumber` | string | ❌ | Formato internacional válido |

### Validaciones de Contraseña

```typescript
interface PasswordValidation {
  minLength: 6;                  // Mínimo 6 caracteres
  mustContain: {
    lowercase: boolean;          // Al menos una minúscula
    uppercase: boolean;          // Al menos una mayúscula
    number: boolean;             // Al menos un número
  };
  cannotBe: {
    sameAsCurrent: boolean;      // No puede ser igual a la actual
  };
}
```

---

## 🔍 Mejores Prácticas

### 1. Gestión de Tokens JWT

```javascript
// ✅ Buena práctica
class AuthService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  getAuthHeaders() {
    return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
  }

  isAuthenticated() {
    return !!this.token;
  }

  logout() {
    localStorage.removeItem('authToken');
    this.token = null;
    window.location.href = '/login';
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...this.getAuthHeaders()
      }
    });

    if (response.status === 401) {
      this.logout();
      throw new Error('Sesión expirada');
    }

    return response;
  }
}
```

### 2. Validación en Frontend

```javascript
// ✅ Validar antes de enviar al backend
const validateProfileData = (data) => {
  const errors = {};

  if (!data.full_name || data.full_name.length < 2) {
    errors.full_name = 'El nombre debe tener al menos 2 caracteres';
  }

  if (data.username && (data.username.length < 3 || data.username.length > 20)) {
    errors.username = 'El username debe tener entre 3 y 20 caracteres';
  }

  if (data.username && !/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username = 'El username solo puede contener letras, números y guiones bajos';
  }

  if (data.address && (data.address.length < 5 || data.address.length > 200)) {
    errors.address = 'La dirección debe tener entre 5 y 200 caracteres';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
```

### 3. Manejo de Estados de Carga

```javascript
// ✅ Estados de loading claros
const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, loadProfile };
};
```

### 4. Optimización de Imágenes

```javascript
// ✅ Redimensionar imágenes antes de subir
const resizeImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};
```

---

## 🚀 Guía Rápida de Implementación

### Paso 1: Configurar Autenticación
```javascript
// 1. Implementar login y guardar token
// 2. Crear interceptor para requests autenticadas
// 3. Manejar expiración de tokens
```

### Paso 2: Implementar Perfil
```javascript
// 1. Crear componente de visualización de perfil
// 2. Agregar formulario de edición
// 3. Implementar validaciones
```

### Paso 3: Agregar Subida de Imágenes
```javascript
// 1. Input de archivo con preview
// 2. Validar tipo y tamaño
// 3. Mostrar progreso de subida
```

### Paso 4: Cambio de Contraseña
```javascript
// 1. Formulario seguro con confirmación
// 2. Validar contraseña nueva
// 3. Mostrar criterios de seguridad
```

---

## 📞 Soporte y Contacto

Para dudas o problemas con la integración:

1. **Revisar esta documentación** completa
2. **Consultar los logs del backend** para errores específicos  
3. **Verificar el archivo de ejemplo** `profile_integration_example.py`
4. **Contactar al equipo de backend** para soporte adicional

---

## 📝 Notas de Versión

**v1.0.0** - Implementación inicial
- ✅ Sistema completo de gestión de perfiles
- ✅ Autenticación JWT
- ✅ Subida de archivos
- ✅ Validaciones robustas
- ✅ Auditoría de cambios

---

*Última actualización: 10 de Junio, 2025*  
*Equipo Backend - Mascotas App* 🐾
