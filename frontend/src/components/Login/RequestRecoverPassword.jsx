import React, { useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import styles from '../../styles/RecoverPassword.module.css';
import { userService } from '../../services/userService';
import { validarCorreo } from '../../utils/usuariosUtils.js';

const RequestRecoverPassword = ({ handleShowForm, handleChangeCorreo }) => {
    const [correo, setCorreo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
    
        if (!validarCorreo(correo)) {
            setErrorMessage("El correo no tiene un formato válido")
            setIsLoading(false)
            return
        }
    
        try {
            const response = await userService.requestPasswordReset({email: correo});
    
            if (response.message) {
                setSuccessMessage(response.message || "¡Correo enviado exitosamente!"); 
                handleChangeCorreo(correo);  
                setTimeout(() => {
                handleShowForm();
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

    return (
        <div className={styles.formBox}>
            <div className={styles.formHeader}>
                <p className={styles.formTitle}>
                   Reestablece tu contraseña</p>
            </div>
            <div className={styles.formLoginBody}>
                <form onSubmit={handleSubmit}>
                    <label className={styles.inputLabel}>
                    Correo electrónico
                    </label>
                    <input 
                        className={styles.formInputEmail}
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    <button className={styles.sendRequestButton}
                        disabled={isLoading}
                    >
                        {isLoading && !successMessage ? 'Enviando código...' : 'Enviar código de reestablecimiento'}
                    </button>
                </form>
            </div>    
            {errorMessage && <div className={styles.mensaje_error}>{errorMessage}</div>}
            {successMessage && <div className={styles.mensaje_exito}>{successMessage}</div>}
        </div>
    );
};

export default RequestRecoverPassword;