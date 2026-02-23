import React, { useState } from 'react'; 
import '../../styles/FormsLogin.css';
import PasswordInput from './PasswordInput';

const FormCambiarClaveLogued = ({ onChangeSuccess, onChangeFail }) => {
    const [newpassword, setNewPassword] = useState('');
    const [currentpassword, setCurrentPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validateForm = () => {
        let currentErrors = []; 
        let isValid = true;   
        if (currentpassword !== '123456') { 
            currentErrors.push('La contraseñ actual no es correcta');
            isValid = false;
        }
        if (newpassword.length < 6) {
            currentErrors.push('La contraseña debe tener al menos 6 caracteres.');
            isValid = false;
        }
        if (newpassword !== confirmPassword) {
            currentErrors.push('La contraseña y su confirmación no coinciden.');
            isValid = false;
        }
        if (currentpassword === '' || newpassword === '' || confirmPassword === '') {
            currentErrors.push('Todos los campos son obligatorios.');
            isValid = false;
        }
        return { isValid, errors: currentErrors.join('\n') };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { isValid, errors } = validateForm();

        if (isValid) {
            setTimeout(() => {
                onChangeSuccess(
                    '¡Contraseña cambiada correctamente!',
                    'perfil',
                    'my_profile'
                );
            }, 500); 
        }
        else {
            setTimeout(() => {
                onChangeFail(
                    '¡Error al cambiar la contraseña!',
                    errors
                );
            }, 500); 
        }
    };

    return (
        <div className='container-modulo-login'>
            <div className='cabecera-modulo-login'>
                <span className='spacer'></span>
                <h1>Cambiar contraseña</h1>
                <a href='/home'><span className='close'>X</span></a>
            </div>
            <form onSubmit={handleSubmit} className='formulario-modulo-login'>
                <PasswordInput
                    className='password'
                    label="Contraseña actual:"
                    id="currentPassword"
                    value={currentpassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    name="currentPassword"
                    required
                />
                <p className='behind-input'>*Debe coincidir con tu contraseña actual</p>
                <PasswordInput
                    label="Confirmar Contraseña:"
                    id="newPassword"
                    value={newpassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    name="confirmPassword"
                    required
                />
                <p className='behind-input'>*La contraseña debe  tener mínimo 8 caracteres 
                    que incluyan mayúsculas, minúsculas, letras, números y símbolos especiales </p>
                <PasswordInput
                    label="Confirmar Contraseña:"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    name="confirmPassword"
                    required
                />
                <p className='behind-input'>*La nueva contraseña ingresada debe coincidir 
                    con la confirmación de contraseña</p>
            <div className='footer-modulo-login'>
                <a href='/my_profile' className='button-secondary'>Descartar</a>
                <button type="submit" className="button-principal">Guardar</button>
            </div>
            </form>
        </div>
    );
};

export default FormCambiarClaveLogued;