import React, { useContext, useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styles from '../../styles/Login.module.css';
import { useGoogleLogin } from '@react-oauth/google';
import { userService } from '../../services/userService';
import { validarCorreo } from '../../utils/usuariosUtils';

const FormLogin = () => {
    const { login } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false)
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        if (!validarCorreo(correo)) {
            setErrorMessage("No es posible inicar sesión porque... El correo no tiene un formato válido")
            setIsLoading(false)
            return
        }

        try {
        const credentials = {
            identifier: correo,
            password,
        };

        const response = await userService.loginUser(credentials);

        if (response.token) {
            login(response.token);
            setSuccessMessage('¡Login exitoso! Redirigiendo...');
            setTimeout(() => {
            navigate('/home');
            }, 1500);
        }
        } catch (error) {
            if (error.message === "Network Error") {
                setErrorMessage("No se pudo conectar con el servidor. Revisa tu conexión o inténtalo más tarde.");
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Ocurrió un error inesperado. Inténtalo más tarde.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
        const response = await userService.googleLogin({
            id_token: credentialResponse.credential
        });

        if (response.token) {
            login(response.token);
            setSuccessMessage('¡Login con Google exitoso! Redirigiendo...');
            setTimeout(() => {
            navigate('/home');
            }, 1500);
        }
        } catch (error) {
            if (error.message === "Network Error") {
                setErrorMessage("No se pudo conectar con el servidor. Revisa tu conexión o inténtalo más tarde.");
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Ocurrió un error inesperado. Inténtalo más tarde.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLoginError = () => {
        setErrorMessage('Error al iniciar sesión con Google. Inténtalo de nuevo.');
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: handleGoogleLoginError,
        flow: 'implicit', // o 'auth-code' si usas backend con intercambio
    });

    return (
        <div className={styles.formBox}>
            <div className={styles.formHeader}>
                <p className={styles.formTitle}>
                   Inicia Sesión</p>
                <p className={styles.registerRedirectText}>
                   ¿No tienes una cuenta?{' '}
                    <Link to="/register" className={styles.registerRedirectLink}>Crea una</Link>
                </p>
            </div>
            <div className={styles.formLoginBody}>
                <form onSubmit={handleSubmit}>
                    <label className={styles.inputLabel}>
                    Correo electrónico
                    </label>
                    <input 
                        className={styles.formInput}
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    <label className={styles.inputLabel}>
                        Contraseña
                    </label>
                    <div className={styles.patitasPasswordContainer}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={styles.formInput}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.patitasPasswordToggle}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <img
                                src={showPassword ? "/icons/closed_eye.svg" : "/icons/open_eye.svg"}
                                alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                width="20"
                                height="20"
                            />
                        </button>
                    </div>
                    <Link to="/recover_password" className={styles.recoverPasswordRedirect}>
                        ¿Olvidaste tu contraseña?
                    </Link>
                    <br />
                    <button className={styles.loginButton}
                        disabled={isLoading}
                    >
                        {isLoading && !successMessage ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>
                <div className={styles.oSeparator}>
                    <span className={styles.horizontalLine}></span>
                    <p className={styles.o}>ó</p>
                    <span className={styles.horizontalLine}></span>
                </div>
                <button onClick={() => loginGoogle()} className={styles.googleButton}>
                    <img
                        src="/icons/google.svg"
                        alt="Google"
                        className={styles.googleIcon}
                        />
                    Iniciar sesión con Google
                </button>
            </div>    
            {errorMessage && <div className={styles.mensaje_error}>{errorMessage}</div>}
            {successMessage && <div className={styles.mensaje_exito}>{successMessage}</div>}
        </div>
    );
};

export default FormLogin;