import axios from "axios";

const userApi = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000,
});

// Interceptor para añadir el token de autenticación si existe
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globales
userApi.interceptors.response.use(
  (response) => response.data, // Solo devolvemos el data
  (error) => {
    console.error("HTTP error:", error);
    return Promise.reject(error);
  }
);

export default userApi;