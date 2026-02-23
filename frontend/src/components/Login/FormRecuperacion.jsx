import {React, useState} from 'react'
import '../../styles/FormsLogin.css';
import apiService from '../../services/apiService'; // Importar apiService

const FormRecuperacion = ({ onChangeSuccess, onChangeFail }) => {
    const [correo, setCorreo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [apiSuccess, setApiSuccess] = useState('');

    const validateForm = () => {
        // Validación básica de frontend, la lógica principal estará en el backend
        if (correo === '' ){
            return { isValid: false, errors: 'El campo de correo es obligatorio.' };
        }
        // Validar formato de email básico (opcional, backend lo hará más robusto)
        if (!/\S+@\S+\.\S+/.test(correo)) {
            return { isValid: false, errors: 'Por favor, ingresa un correo electrónico válido.' };
        }
        return { isValid: true, errors: '' };
    };

    const handleSubmit = async (e) => { // Convertir a async
        e.preventDefault();
        setApiError('');
        setApiSuccess('');
        const { isValid, errors } = validateForm();

        if (!isValid) {
            setApiError(errors);
            // Ya no se usa onChangeFail para errores de validación simples
            // if (onChangeFail) { // Asegurarse de que la prop exista antes de llamarla
            //     onChangeFail('Error de validación', errors);
            // }
            return;
        }

        setIsLoading(true);
        try {
            console.log('Value of correo before API call:', correo);
            console.log('Type of correo before API call:', typeof correo);
            // const payload = { email: correo }; // Incorrect: apiService.forgotPassword expects the email string directly
            // console.log('Payload object to apiService.forgotPassword:', payload); 
            // console.log('Stringified payload for API call:', JSON.stringify(payload));

            // Llamada a la API para solicitar el reseteo de contraseña
            // Pass the email string directly, as apiService.forgotPassword will wrap it in an object
            const response = await apiService.forgotPassword(correo); 
            console.log('Respuesta de forgotPassword API:', response);
            
            // El backend responde con un mensaje genérico por seguridad
            // "Si el correo está registrado, recibirás un código para restablecer tu contraseña"
            setApiSuccess(response.message || 'Solicitud enviada. Si tu correo está registrado, recibirás un código en breve.');
            
            // Notificar al componente padre para cambiar la vista a FormCambiarClave
            if (onChangeSuccess && typeof onChangeSuccess === 'function') {
                 // Pasar un identificador para que el padre sepa qué mostrar
                 // y el correo, por si FormCambiarClave lo necesita (aunque el token es lo principal)
                 onChangeSuccess('show_reset_form', correo); 
            }

        } catch (error) {
            console.error('Error en forgotPassword API:', error);
            setApiError(error.message || 'Error al procesar la solicitud. Inténtalo de nuevo más tarde.');
            // if (onChangeFail) { // Asegurarse de que la prop exista antes de llamarla
            //     onChangeFail('Error en la solicitud', error.message || 'Error desconocido');
            // }
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className='container-modulo-login'>
            <h1>Restablecer Contraseña</h1>
            <p>Ingresa el correo electrónico asociado a tu cuenta.
                Si está registrado, te enviaremos un código de confirmación
                para restablecer tu contraseña.
            </p>
            <form onSubmit={handleSubmit} className='formulario-modulo-login'>
                <label htmlFor="email-recuperacion">Correo</label>
                <input
                    id="email-recuperacion"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="button-principal"
                    disabled={isLoading}
                >
                    {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
            </form>
            {apiError && <div className="mensaje-error" style={{marginTop: '10px'}}>{apiError}</div>}
            {apiSuccess && <div className="mensaje-exito" style={{marginTop: '10px'}}>{apiSuccess}</div>}
        </div>
    )
}

export default FormRecuperacion;