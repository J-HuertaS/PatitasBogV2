import React, { useState } from 'react';
import styles from '../../styles/RecoverPassword.module.css';
import LogoHeaderPink from '../../components/Principal/LogoHeaderPink';
import LogoHeaderBrown from '../../components/Principal/LogoHeaderBrown';
import RequestRecoverPassword from '../../components/Login/RequestRecoverPassword';
import FormRecoverPassword from '../../components/Login/FormRecoverPassword';

const ViewRecoverPassword = () => {
  const [showForm, setShowForm] = useState(false);
  const [correo, setCorreo] = useState('');

  const handleShowForm = () => {
    setShowForm(!showForm)
  }
  
  const handleChangeCorreo = (correo) => {
    setCorreo(correo)
  }

  return (
      <div className={showForm ? styles.background2 : styles.background}>
        {!showForm && (<LogoHeaderPink />)}
        {showForm && (<LogoHeaderBrown />)}
        {!showForm && (<RequestRecoverPassword 
          handleShowForm={handleShowForm}
          handleChangeCorreo={handleChangeCorreo}/>)}
        {showForm && (<FormRecoverPassword correo={correo}/>)}
      </div>
  );
};

export default ViewRecoverPassword;