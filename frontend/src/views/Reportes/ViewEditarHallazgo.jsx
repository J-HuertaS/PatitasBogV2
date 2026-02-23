import React, { useState } from 'react';
import FormEditarHallazgo from '../../components/Reportes/FormEditarHallazgo'
import Success from '../../components/Principal/Success';
import Fail from '../../components/Principal/Fail';

const ViewEditarHallazgo = () => {
    const mascota = 'Firulais';
    const fecha = '2025-06-11';
    const hora = '15:30';
    const detalles = 'Se escapó en el parque cerca de la calle 80.';
    const ubicacion = { lat: 4.65, lng: -74.05 };
    const imagen = '/images/foto_mascota.png';
    
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [titleSuccess, setTitleSuccess] = useState('');  
    const [endSuccess, setEndSuccess] = useState('');     
    const [redirectSuccess, setRedirectSuccess] = useState(''); 
    
    const handleChangeSuccess = (title, end, redirect) => {
        setTitleSuccess(title);
        setEndSuccess(end);
        setRedirectSuccess(redirect);
        setShowSuccessPopup(true);
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
            <FormEditarHallazgo mascota={mascota}
                fecha={fecha}
                hora={hora}
                detalles={detalles}
                ubicacion={ubicacion}
                imagen={imagen}
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

export default ViewEditarHallazgo;