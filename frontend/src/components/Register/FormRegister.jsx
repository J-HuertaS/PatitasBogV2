import React, { useState } from 'react';
import '../../styles/FormRegister.css';
import { Link } from 'react-router-dom';
import PasswordInput from '../Login/PasswordInput';
import apiService from '../../services/apiService';

const FormRegister = ({ onRegister, onFail }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validaciones
  const validarCorreo = (correo) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const validarPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validaciones con mensajes personalizados
    if (!nombre || !correo || !password || !confirmarPassword) {
      setErrorMessage('No es posible registrarse porque... Algún campo está vacío');
      setIsLoading(false);
      if (onFail) onFail('No es posible registrarse', 'Algún campo está vacío');
      return;
    }
    if (!validarCorreo(correo)) {
      setErrorMessage('No es posible registrarse porque... El correo no tiene un formato válido');
      setIsLoading(false);
      if (onFail) onFail('No es posible registrarse', 'El correo no tiene un formato válido');
      return;
    }
    if (!validarPassword(password)) {
      setErrorMessage('No es posible registrarse porque... La contraseña no cumple los estándares');
      setIsLoading(false);
      if (onFail) onFail('No es posible registrarse', 'La contraseña no cumple los estándares');
      return;
    }
    if (password !== confirmarPassword) {
      setErrorMessage('No es posible registrarse porque... La confirmación no coincide con la contraseña');
      setIsLoading(false);
      if (onFail) onFail('No es posible registrarse', 'La confirmación no coincide con la contraseña');
      return;
    }

    try {
      const userData = {
        nombre,
        email: correo,
        password
      };

      const response = await apiService.register(userData);

      setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo a login...');
      if (onRegister) {
        onRegister(
          '¡Cuenta creada con éxito!',
          'Redirigiendo a login...',
          '/login'
        );
      }
    } catch (error) {
      setErrorMessage(
        'No es posible registrarse porque... ' +
          (error.message || 'Error desconocido')
      );
      if (onFail) {
        onFail('No es posible registrarse', error.message || 'Error desconocido');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="formreg-container">
      <div className="formreg-header">
        <h2>¿Quiénes Somos?</h2>
        <p>
          Ante la angustia diaria de perder una mascota en Bogotá, nace una plataforma que une a una comunidad solidaria para acelerar su reencuentro y no dejar que nadie busque solo.
        </p>
      </div>
      <form className="formreg-form" onSubmit={handleSubmit}>
        <h1 className="formreg-title">Registro</h1>
        <div className="formreg-row">
          <div className="formreg-field">
            <label className="formreg-title">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="formreg-field">
            <label className="formreg-title">Correo</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
            />
            <span className="formreg-help">Ingrese un correo electrónico válido</span>
          </div>
        </div>
        <div className="formreg-row">
          <div className="formreg-field">
            <label className="formreg-title">Contraseña</label>
            <PasswordInput
              label=""
              id="registerPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="formreg-help">
              La contraseña debe tener al menos 6 caracteres e incluir una minúscula, mayúscula y un número
            </span>
          </div>
          <div className="formreg-field">
            <label className="formreg-title">Confirmar Contraseña</label>
            <PasswordInput
              label=""
              id="confirmPassword"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
            />
            <span className="formreg-help">
              La confirmación de contraseña debe coincidir con la contraseña ingresada
            </span>
          </div>
        </div>
        {errorMessage && <div className="formreg-error">{errorMessage}</div>}
        {successMessage && <div className="formreg-success">{successMessage}</div>}
        <button type="submit" className="formreg-btn" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
        <div className="formreg-footer">
          ¿Ya estás registrado?{' '}
          <Link to="/login" className="formreg-login-link">
            Iniciar Sesión
          </Link>
        </div>
      </form>
    </div>
  );
};

export default FormRegister;