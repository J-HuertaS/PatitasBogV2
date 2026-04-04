import React, { useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styles from '../../styles/RecoverPassword.module.css';
import { userService } from '../../services/userService';
import { validarPassword, getPasswordValidations } from "../../utils/usuariosUtils";

const FormChangePassword = ( { correo } ) => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
            
        if (!validarPassword(password)) {
            setErrorMessage("No es posible cambiar la contraseña porque... La contraseña no cumple los estándares")
            setIsLoading(false)
            if (onFail) onFail("No es posible cambiar la contraseña", "La contraseña no cumple los estándares")
            return
        }
        
        if (password !== confirmPassword) {
            setErrorMessage("No es posible cambiar la contraseña porque... La confirmación no coincide con la contraseña")
            setIsLoading(false)
            if (onFail) onFail("No es posible cambiar la contraseña", "La confirmación no coincide con la contraseña")
            return
        }
            
        try {
            const data = {
                currentPassword: currentPassword,      
                newPassword: password 
            }

            console.log(data);
            console.log(localStorage.getItem("authToken"));

            const response = await userService.changePassword(data);

            console.log(response);
            
            if (response.message) {
                setSuccessMessage(response.message || "¡Contraseña cambiada correctamente!");   
                setTimeout(() => {
                    navigate('/home');
                }, 1500);
            }

            console.log(response);

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

    const validaciones = getPasswordValidations(password, confirmPassword)

    return (
        <div className={styles.formBox}>
            <div className={styles.formHeader2}>
                <p className={styles.formTitle2}>
                   Cambiar Contraseña</p>
            </div>
            <div className={styles.formLoginBody}>
                <form onSubmit={handleSubmit}>
                    <label className={styles.inputLabel}>
                    Contraseña actual
                    </label>
                    <div className={styles.patitasPasswordContainer}>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            className={styles.formInput}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.patitasPasswordToggle}
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            <img
                                src={showCurrentPassword ? "/icons/closed_eye.svg" : "/icons/open_eye.svg"}
                                alt={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                width="20"
                                height="20"
                            />
                        </button>
                    </div>
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
                    {/* Validaciones visuales */}
                    <div className={styles.patitasValidationChecks}>
                        <div className={`${styles.patitasValidationItem} ${validaciones.longitud ? styles.valid : ""}`}>
                            <span className={styles.patitasCheckIcon}>{validaciones.longitud ? "✓" : "○"}</span>
                            <span>Incluye 6 caracteres</span>
                        </div>
                        <div className={`${styles.patitasValidationItem} ${validaciones.mayuscula ? styles.valid : ""}`}>
                            <span className={styles.patitasCheckIcon}>{validaciones.mayuscula ? "✓" : "○"}</span>
                            <span>Incluye una mayúscula</span>
                        </div>
                        <div className={`${styles.patitasValidationItem} ${validaciones.minuscula ? styles.valid : ""}`}>
                            <span className={styles.patitasCheckIcon}>{validaciones.minuscula ? "✓" : "○"}</span>
                            <span>Incluye una minúscula</span>
                        </div>
                        <div className={`${styles.patitasValidationItem} ${validaciones.numero ? styles.valid : ""}`}>
                            <span className={styles.patitasCheckIcon}>{validaciones.numero ? "✓" : "○"}</span>
                            <span>Incluye un número</span>
                        </div>
                    </div>
                    <label className={styles.inputLabel2}>
                        Confirmación de contraseña
                    </label>
                    <div className={styles.patitasPasswordContainer}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={styles.formInput}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={styles.patitasPasswordToggle}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <img
                                src={showConfirmPassword ? "/icons/closed_eye.svg" : "/icons/open_eye.svg"}
                                alt={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                width="20"
                                height="20"
                            />
                        </button>
                    </div>
                    {/* Validación de coincidencia */}
                    {confirmPassword && (
                        <div className={`${styles.patitasValidationItem} ${validaciones.coincide ? styles.valid : ""}`}>
                            <span className={styles.patitasCheckIcon}>{validaciones.coincide ? "✓" : "○"}</span>
                            <span>Coincide con la contraseña ingresada</span>
                        </div>
                    )}
                    <button className={styles.ChangeButton}
                        disabled={isLoading}
                    >
                        {isLoading && !successMessage ? 'Reestableciendo...' : 'Reestablecer'}
                    </button>
                </form>
            </div>    
            {errorMessage && <div className={styles.mensaje_error}>{errorMessage}</div>}
            {successMessage && <div className={styles.mensaje_exito}>{successMessage}</div>}
        </div>
    );
};

export default FormChangePassword;