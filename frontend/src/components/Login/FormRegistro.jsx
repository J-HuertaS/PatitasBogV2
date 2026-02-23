import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import PasswordInput from './PasswordInput';
import '../../styles/FormsLogin.css';

const FormRegistro = ({ onChangeSuccess, onChangeFail }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit_FE: Form submitted');
        setError('');

        if (formData.password !== formData.confirmPassword) {
            console.log('handleSubmit_FE: Passwords do not match');
            setError('Las contraseñas no coinciden.');
            onChangeFail('Error de Registro', 'Las contraseñas no coinciden.');
            return;
        }

        if (formData.password.length < 6) {
            console.log('handleSubmit_FE: Password too short');
            setError('La contraseña debe tener al menos 6 caracteres.');
            onChangeFail('Error de Registro', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        console.log('handleSubmit_FE: Validations passed, attempting API call');
        console.log('handleSubmit_FE: FormData to send:', formData);

        try {
            const payload = {
                full_name: formData.full_name, // Asegúrate que el backend espera full_name
                email: formData.email,
                password: formData.password,
            };
            console.log('handleSubmit_FE: Payload for API:', payload);

            const response = await ApiService.post('/users/register', payload);
            
            console.log('handleSubmit_FE: API call successful, response:', response);

            if (response && response.message) {
                onChangeSuccess('¡Registro Exitoso!', response.message, '/login');
            } else {
                onChangeSuccess('¡Registro Exitoso!', 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.', '/login');
            }
        } catch (err) {
            console.error('handleSubmit_FE: API call failed, error:', err);
            const errorMessage = err.data?.message || err.message || 'Error al registrar la cuenta. Inténtalo de nuevo.';
            setError(errorMessage);
            onChangeFail('Error de Registro', errorMessage);
        }
    };    
    return (
        <div className="container-modulo-login">
            <h2>Crear Nueva Cuenta</h2>
            <form onSubmit={handleSubmit} className="formulario-modulo-login">
                <label htmlFor="full_name" className="label-formulario-login">Nombre Completo</label>
                <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                />
                
                <label htmlFor="email" className="label-formulario-login">Correo Electrónico</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                
                <PasswordInput
                    label="Contraseña"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <PasswordInput
                    label="Confirmar Contraseña"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                
                {error && <p style={{color: 'var(--red)', marginTop: '1rem'}}>{error}</p>}
                <button type="submit" className="button-principal">Registrarse</button>
            </form>
            <p style={{marginTop: '1rem'}}>
                ¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a>
            </p>
        </div>
    );
};

export default FormRegistro;