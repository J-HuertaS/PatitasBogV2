import React, { useState } from 'react';
import Bienvenida from '../../components/Login/Bienvenida';
import FormLogin from '../../components/Login/FormLogin';
import Success from '../../components/Principal/Success';
import Fail from '../../components/Principal/Fail';

const ViewLogin = () => {
  // Puede usar estos estados si quieres mostrar popups de éxito o error
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
      <FormLogin
        onLogin={handleChangeSuccess}
        onFail={handleChangeFail}
        onGoogleLogin={() => window.location.href = 'https://accounts.google.com/'}
        onForgotPassword={() => window.location.href = '/recover_password_request'}
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

export default ViewLogin;