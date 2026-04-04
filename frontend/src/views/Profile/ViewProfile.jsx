import React, { useState } from 'react';
import styles from '../../styles/Profile.module.css';
import FormProfile from '../../components/Profile/FormProfile';

const ViewProfile = () => {
  return (
      <div className={styles.background}>
        <FormProfile />
      </div>
  );
};

export default ViewProfile;