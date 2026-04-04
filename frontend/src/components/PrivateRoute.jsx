import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <div>Cargando...</div>; // ⏳ puedes poner un spinner bonito

  return isAuthenticated ? children : <Navigate to="/" replace />;
};


export default PrivateRoute;
