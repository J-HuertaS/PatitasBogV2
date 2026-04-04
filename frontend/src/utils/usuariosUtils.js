// Funciones de validación reutilizables

export const validarCorreo = (correo) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)

export const validarPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)

export const getPasswordValidations = (password, confirmar = "") => ({
  longitud: password.length >= 6,
  mayuscula: /[A-Z]/.test(password),
  minuscula: /[a-z]/.test(password),
  numero: /\d/.test(password),
  coincide: confirmar ? password === confirmar && password !== "" : false,
})
