import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Bienvenida from '../../components/Login/Bienvenida';
import FormCambiarClave from '../../components/Login/FormCambiarClave';
import Success from '../../components/Principal/Success';
import Fail from '../../components/Principal/Fail';

const ViewCambiarClave = () => {
    const navigate = useNavigate(); // Hook para navegación
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [titleSuccess, setTitleSuccess] = useState('');  
    const [endSuccess, setEndSuccess] = useState('');     
    const [redirectSuccess, setRedirectSuccess] = useState(''); 

    const handleChangeSuccess = (title, end, redirect) => {
        if (redirect === 'login') {
            // Si se especifica redirect a 'login', navegar y opcionalmente mostrar un mensaje breve o ninguno.
            // Por ahora, simplemente navegamos. Se podría pasar un estado a la página de login si es necesario.
            navigate('/login'); 
            // Podrías decidir no mostrar el popup de Success si la redirección es inmediata.
            // O mostrarlo y que el popup mismo tenga un botón que redirija.
        } else {
            // Lógica existente para el popup de éxito
            setTitleSuccess(title);
            setEndSuccess(end);
            setRedirectSuccess(redirect); // Esto podría ser una URL completa o una ruta interna
            setShowSuccessPopup(true);
        }
    };

    const [showFailPopup, setShowFailPopup] = useState(false);
    const [titleFail, setTitleFail] = useState('');  
    const [bodyFail, setBodyFail] = useState('');      

    const handleChangeFail= (title, body) => {
        setTitleFail(title);
        setBodyFail(body);
        setShowFailPopup(true);
    };

    return (
        <div className='generic-container'>
            <Bienvenida />
            <FormCambiarClave
                onChangeSuccess={handleChangeSuccess}
                onChangeFail={handleChangeFail}
            />
            {showSuccessPopup && (
                <Success
                    title={titleSuccess}
                    end={endSuccess}
                    redirect={redirectSuccess}
                />
            )}
            {showFailPopup && (
                <Fail
                    setShowFailPopup={setShowFailPopup}
                    title={titleFail}
                    body={bodyFail}
                />
            )}
        </div>
    );
};

export default ViewCambiarClave;