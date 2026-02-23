import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

// Proveedor que envuelve tu app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    // Escucha cambios al storage (desde otras pestañas o logout/login)
    window.addEventListener('storage', checkToken);

    return () => window.removeEventListener('storage', checkToken);
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
