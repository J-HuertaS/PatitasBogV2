import React, { useState } from 'react';
import styles from '../../styles/ChangePassword.module.css';
import LogoHeaderPink from '../../components/Principal/LogoHeaderPink';
import FormChangePassword from '../../components/Profile/FormChangePassword';

const ViewChangePassword  = () => {
  return (
      <div className={styles.background}>
        <FormChangePassword />
      </div>
  );
};

export default ViewChangePassword ;