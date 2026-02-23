// src/components/layout/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Navbar.css';
import { AuthContext } from '../../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Traemos estado y acciones del contexto
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();          // Limpia el token y actualiza el contexto
    navigate('/');     // Redirige al home principal
  };

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="Barra de navegación principal"
    >
      <Link
        to="/"
        className="logo-link"
        aria-label="Redirección a página de inicio"
      >
        <div className="logo-section">
          <div className="logo-container">
            <img
              src="/images/logo.png"
              alt="Logo de PatitasBog"
              className="logo"
            />
          </div>
          <span className="logo-text">PatitasBog</span>
        </div>
      </Link>

      <div className="nav-links">
        {!isAuthenticated && (
          <Link
            to="/register"
            className="link-register"
            aria-label="Registrarse en la aplicación"
          >
            Regístrate
          </Link>
        )}

        {isAuthenticated ? (
          <button
            className="btn-login"
            role="button"
            aria-label="Cerrar sesión"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        ) : (
          <Link
            to="/login"
            className="btn-login"
            role="button"
            aria-label="Ir a la página de inicio de sesión"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
