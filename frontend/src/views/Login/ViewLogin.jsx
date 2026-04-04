import React, { useState } from 'react';
import styles from '../../styles/Login.module.css';
import LogoHeaderPink from '../../components/Principal/LogoHeaderPink';
import FormLogin from '../../components/Login/FormLogin';

const ViewLogin = () => {
  return (
      <div className={styles.background}>
        <LogoHeaderPink />
        <FormLogin />
      </div>
  );
};

export default ViewLogin;