import React, { useState, useContext } from 'react';
import PasswordInput from './PasswordInput';
import '../../styles/FormsLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../../contexts/AuthContext'; // ✅ Importar el contexto

const FormLogin = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(AuthContext); // ✅ Obtener la función login del contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const credentials = {
        email: correo,
        password,
      };

      console.log('🔐 Intentando login con:', {
        email: credentials.email,
        password: '***',
      });

      const response = await apiService.login(credentials);

      console.log('✅ Login response:', response);

      if (response.token) {
        apiService.saveToken(response.token);
        localStorage.setItem('userProfile', JSON.stringify(response.user));
        login(response.token); // ✅ Actualiza el estado del contexto
        setSuccessMessage('¡Login exitoso! Redirigiendo...');

        setTimeout(() => {
          navigate('/home');
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Error de login:', error);
      setErrorMessage(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    console.log('🔑 Google credentialResponse:', credentialResponse);

    try {
      const response = await apiService.googleLogin({ token: credentialResponse.credential });
      console.log('✅ Google Login response:', response);

      if (response.token) {
        apiService.saveToken(response.token);
        localStorage.setItem('userProfile', JSON.stringify(response.user));
        login(response.token); // ✅ También actualiza el contexto
        setSuccessMessage('¡Login con Google exitoso! Redirigiendo...');
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Error de login con Google:', error);
      setErrorMessage(error.message || 'Error al iniciar sesión con Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    console.error('❌ Google Login Failed');
    setErrorMessage('Error al iniciar sesión con Google. Inténtalo de nuevo.');
  };

  return (
    <div className="container-modulo-login">
      <form onSubmit={handleSubmit}>
        <label className="label-formulario">Correo</label>
        <input
          type="email"
          className="input-formulario"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <label className="label-formulario-login">Contraseña</label>
        <PasswordInput
          label=""
          id="loginPassword"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="button-principal"
          disabled={isLoading}
        >
          {isLoading && !successMessage ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        <div className="separador-o-login">ó</div>

        <div className="google-login-button-container">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            useOneTap
          />
        </div>
      </form>

      <Link to="/recover_password_request" className="link-recuperar-clave">
        ¿Olvidaste tu contraseña?
      </Link>

      {errorMessage && <div className="mensaje-error">{errorMessage}</div>}
      {successMessage && <div className="mensaje-exito">{successMessage}</div>}
    </div>
  );
};

export default FormLogin;
