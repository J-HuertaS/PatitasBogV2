import React, { useState } from 'react';
import FormCrearPerdida from '../../components/Reportes/FormCrearPerdida'
import Success from '../../components/Principal/Success';
import Fail from '../../components/Principal/Fail';

const ViewCrearPerdida = () => {    
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
            <FormCrearPerdida 
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

export default ViewCrearPerdida;