import userApi from "./httpClients/userApi";

export const userService = {
  // Métodos de registro y login
  registerUser: (userData) => userApi.post("/api/users/register", userData),
  loginUser: (credentials) => userApi.post("/api/users/login", credentials),
  // Método para obtener el perfil del usuario
  getUserProfile: () => userApi.get("/api/profile"),
  updateUserProfile: (userData) => userApi.put("/api/profile", userData),
  changePassword: (passwordData) =>
    userApi.put("/api/profile/change-password", passwordData),
  uploadProfilePicture: (formData) =>
    userApi.post("/api/profile/upload-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Métodos para recuperar contraseña
  requestPasswordReset: () => userApi.post("/api/auth/forgot-password"),
  verifyToken: (token) => userApi.post("/api/auth/verify-token", { token }),
  resetPassword: (passwordData) =>
    userApi.post("/api/auth/reset-password", passwordData),
};