import React, { useState } from 'react';
import '../../styles/PasswordInput.css';

const PasswordInput = ({ label, id, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const eyeOpenSvgPath = '/icons/EyeIcon.svg';
    const eyeSlashSvgPath = '/icons/EyeSlashIcon.svg';
    return (
        <div className="password-input-container">
            {label && <label htmlFor={id}>{label}</label>}
            <div className="input-wrapper">
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    {...props}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="toggle-password-button"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                    <img
                        src={showPassword ? eyeSlashSvgPath : eyeOpenSvgPath}
                        alt={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        className="password-toggle-icon"
                    />
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;