import React, { useState, useEffect } from 'react'; // Keep useState, add useEffect
import { useLocation } from 'react-router-dom'; // Importar useLocation
import '../../styles/FormsLogin.css';
import PasswordInput from './PasswordInput';
import apiService from '../../services/apiService'; // Importar apiService

const FormCambiarClave = ({ onChangeSuccess, onChangeFail }) => {
    const location = useLocation(); // Hook para acceder al estado de la ruta
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [codeConfirmation, setCodeConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado para feedback de carga
    const [apiError, setApiError] = useState('');     // Estado para errores de API

    useEffect(() => {
        // Obtener el email del estado de la ruta si existe
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        }
    }, [location.state]);

    const validateForm = () => {
        let currentErrors = []; 
        let isValid = true;   

        if (password.length < 6) {
            currentErrors.push('La contraseña debe tener al menos 6 caracteres.');
            isValid = false;
        }
        if (password !== confirmPassword) {
            currentErrors.push('La contraseña y su confirmación no coinciden.');
            isValid = false;
        }
        if (password === '' || confirmPassword === '' || codeConfirmation === '') { // No validar email aquí, ya que viene de la ruta
            currentErrors.push('Todos los campos son obligatorios: nueva contraseña, confirmación y código.');
            isValid = false;
        }
        // Ya no se valida el código aquí, se hará en el backend
        // if (codeConfirmation !== '12345') { 
        //     currentErrors.push('El código de confirmación no coincide.');
        //     isValid = false;
        // }
        return { isValid, errors: currentErrors.join('\n') };
    };

    const handleSubmit = async (e) => { // Convertir a async
        e.preventDefault();
        setApiError('');
        const { isValid, errors } = validateForm();

        if (!isValid) {
            // Mostrar errores de validación directamente en el formulario
            setApiError(errors);
            // Ya no se usa onChangeFail para errores de validación simples
            // if (onChangeFail) {
            //     onChangeFail('Error de validación', errors);
            // }
            return;
        }

        setIsLoading(true);
        try {
            // Primero, verificar el token (código de confirmación)
            // Asumimos que el `codeConfirmation` es el token que el backend espera.
            // El backend debería validar este token contra el email si es necesario,
            // o el token en sí mismo ya está asociado al email.
            await apiService.verifyResetToken(email, codeConfirmation); // Pass email and codeConfirmation
            
            // Si el token es válido, proceder a cambiar la contraseña
            // El backend usará el token (código) para identificar al usuario y cambiar su contraseña.
            const response = await apiService.resetPassword(codeConfirmation, password);

            // Llamar a onChangeSuccess para notificar al padre y redirigir o mostrar mensaje
            if (onChangeSuccess) {
                onChangeSuccess(
                    response.message || '¡Contraseña cambiada correctamente!',
                    'login', // Redirigir a login
                    'login'  // Estado o tipo para el componente padre
                );
            }
        } catch (error) {
            console.error('Error en el proceso de cambio de contraseña:', error);
            let errorMessage = 'Error al cambiar la contraseña.';
            if (error.data && error.data.message) {
                errorMessage = error.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setApiError(errorMessage);
            // if (onChangeFail) {
            //     onChangeFail(
            //         '¡Error al cambiar la contraseña!',
            //         errorMessage
            //     );
            // }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container-modulo-login'>
            <h1>Reestablecer Contraseña</h1>
            {email && <p>Cambiando contraseña para: <strong>{email}</strong></p>} {/* Mostrar email si está disponible */}
            <form onSubmit={handleSubmit} className='formulario-modulo-login'>
                <PasswordInput
                    label="Nueva Contraseña:"
                    id="newPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="newPassword"
                    required
                />
                <p className='behind-input'>*La contraseña debe  tener mínimo 8 caracteres que 
                    incluyan mayúsculas, minúsculas, letras, números y símbolos especiales </p>
                <PasswordInput
                    label="Confirmar Contraseña:"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    name="confirmPassword"
                    required
                />
                <p className='behind-input'>*La confirmación de contraseña debe coincidir con
                    la nueva contraseña </p>
                <label>Código de confirmación</label>
                <input
                    type="text"
                    value={codeConfirmation}
                    onChange={(e) => setCodeConfirmation(e.target.value)}
                    disabled={isLoading} // Deshabilitar en carga
                />
                <p className='behind-input'>*El código debe coincidir con el código enviado
                    al correo </p>
                <button type="submit" className="button-principal" disabled={isLoading}>
                    {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'} {/* Cambiar texto del botón en carga */}
                </button>
                {apiError && <div className="mensaje-error" style={{marginTop: '10px'}}>{apiError}</div>}
            </form>
        </div>
    );
};

export default FormCambiarClave;