import React, { useState } from 'react';
import Success from '../../components/Principal/Success';
import Fail from '../../components/Principal/Fail';
import HomeLogin from '../../components/Home/HomeLogin';

// Vista principal del home cuando el usuario está logueado
const ViewHomeLogin = () => {
  // Estados para mostrar el popup de éxito
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [titleSuccess, setTitleSuccess] = useState('');
  const [endSuccess, setEndSuccess] = useState('');
  const [redirectSuccess, setRedirectSuccess] = useState('');

  // Handler para mostrar el popup de éxit
  const handleChangeSuccess = (title, end, redirect) => {
    setTitleSuccess(title);
    setEndSuccess(end);
    setRedirectSuccess(redirect);
    setShowSuccessPopup(true);
  };

  // Estados para mostrar el popup de error
  const [showFailPopup, setShowFailPopup] = useState(false);
  const [titleFail, setTitleFail] = useState('');
  const [bodyFail, setBodyFail] = useState('');

  // Handler para mostrar el popup de error
  const handleChangeFail = (title, body) => {
    setTitleFail(title);
    setBodyFail(body);
    setShowFailPopup(true);
  };

  return (
    <div className="generic-container">
      {/* Componente central que muestra la barra superior y los reportes */}
      <HomeLogin
        onChangeSuccess={handleChangeSuccess}
        onChangeFail={handleChangeFail}
      />
      {/* Popup de éxito */}
      {showSuccessPopup && (
        <Success
          title={titleSuccess}
          end={endSuccess}
          redirect={redirectSuccess}
        />
      )}
      {/* Popup de error */}
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

export default ViewHomeLogin;