import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⏳ Cargando estado inicial

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        // Aseguramos que tenga user._id si solo viene userId en el token
        setUser({ ...decoded, _id: decoded.userId || decoded._id });
      } catch (err) {
        console.error("Token inválido", err);
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      setUser({ ...decoded, _id: decoded.userId || decoded._id });
    } catch (err) {
      console.error("Token inválido en login:", err);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
