import axios from "axios";

const reportApi = axios.create({
  baseURL: "http://localhost:5050/",
  timeout: 5000,
});

// Interceptor para añadir el token de autenticación si existe
reportApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globales
reportApi.interceptors.response.use(
  (response) => response.data, // Solo devolvemos el data
  (error) => {
    console.error("HTTP error:", error);
    return Promise.reject(error);
  }
);

export default reportApi;