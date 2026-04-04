import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/Profile.module.css';
import { userService } from '../../services/userService';

const FormProfile = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [genero, setGenero] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState ('');
    const [foto, setFoto] = useState ('');
    const [previewfoto, setPreviewFoto] = useState('/images/sin_foto_perfil.png');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState ('');
    const [errorMessage, setErrorMessage] = useState ('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { profile } = await userService.getUserProfile();
                console.log(profile);
                setNombre(profile.full_name);
                setEmail(profile.email);
                setUser(profile.username);
                setGenero(profile.gender);
                setDireccion(profile.address);
                setTelefono(profile.phoneNumber);
                setFoto(profile.profilePicture);
                setPreviewFoto(`http://localhost:5000${profile.profilePicture}` || '/images/sin_foto_perfil.png');
            } catch (error) {
                setErrorMessage("Error cargando perfil");
                console.log(error);
            }
    };

        fetchData(); 
    }, []);

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

            const formData = new FormData();
            formData.append('file', file)

            try {
                const response = await userService.uploadProfilePicture(formData);
                console.log('Imagen subida:', response);

                if (response.profile_picture) {
                    setFoto(response.profile_picture); 
                    const previewURL = URL.createObjectURL(file);
                    setPreviewFoto(previewURL);
                } else {
                    console.warn('No se recibió la URL de la imagen');
                }

            } catch (error) {
                console.error('Error al subir imagen:', error);
            }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nombre.trim() == "") {
            setErrorMessage("Los campos obligatorios no pueden estar vacios");
            return
        }

        if (email.trim() == "") {
            setErrorMessage("Los campos obligatorios no pueden estar vacios");
            return
        }

        setIsLoading(true);  

        try {
            const profileData = {
                full_name: nombre,
                email: email,
                username: user,
                gender: genero,
                address: direccion,
                phoneNumber: telefono,
                profilePicture: foto,
            };
            
            const response = await userService.updateUserProfile(profileData);
        
            console.log(response);

            if (!response.error) {
                setSuccessMessage('¡Actualización exitosa! Redirigiendo...');
                setTimeout(() => {
                navigate('/home');
                }, 1500);
            }
        } catch (error) {
            console.log("Error")
            console.log(error)
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
    }

    return (
        <div className={styles.form_container}>
            <p className={styles.title}>Mi Perfil</p>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.options_column}>
                    <div className={styles.foto_perfil_container}>
                        <img src={previewfoto}
                        className={styles.foto_perfil}
                    ></img>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="fileInput"
                        onChange={handleUploadPhoto}
                    />

                    <button
                        type="button"
                        className={styles.options_button}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        Subir foto de perfil
                    </button>
                    <button type="submit" className={styles.options_button}>{isLoading ? 'Guardando cambios...' : 'Guardar cambios'}</button>
                    <Link to="/change_password" className={styles.options_button2}>Cambiar contraseña</Link>
                </div>
                <div className={styles.fields_column}>
                    <label className={styles.firstinputLabel}>Nombre completo*</label>
                    <input type='text' className={styles.formInput}
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    ></input>
                    <label className={styles.inputLabel}>Correo electrónico*</label>
                    <input type='email' className={styles.formInput}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    ></input>
                    <label className={styles.inputLabel}>Usuario</label>
                    <input type='text' className={styles.formInput}
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    ></input>
                    <label className={styles.inputLabel}>Sexo</label>
                    <select
                        className={styles.formInput}
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                        required
                        >
                        <option value="">Seleccione...</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                        <option value="prefer_not_to_say">Prefiere no decir</option>
                    </select>
                    <label className={styles.inputLabel}>Dirección</label>
                    <input type='text' className={styles.formInput}
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    ></input>
                    <label className={styles.inputLabel}>Número de teléfono</label>
                    <input type='text' className={styles.formInput}
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    ></input>
                    <p>Los campos marcados con * son obligatorios</p>
                    {errorMessage && <div className={styles.mensaje_error}>{errorMessage}</div>}
                    {successMessage && <div className={styles.mensaje_exito}>{successMessage}</div>}
                </div>
            </form>
        </div>
    );
};

export default FormProfile;