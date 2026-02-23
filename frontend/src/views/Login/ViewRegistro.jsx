import React, { useState } from 'react';
import Bienvenida from '../../components/Login/Bienvenida';
import FormRegistro from '../../components/Login/FormRegistro';
import Success from '../../components/Principal/Success';
import Fail from '../../components/Principal/Fail';
import '../../styles/Layout.css'; // Asegura que los estilos generales se apliquen

const ViewRegistro = () => {
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

    const handleChangeFail = (title, body) => {
        setTitleFail(title);
        setBodyFail(body);
        setShowFailPopup(true);
    };

    return (
        <div className="generic-container">
            <Bienvenida />
            <FormRegistro 
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

export default ViewRegistro;