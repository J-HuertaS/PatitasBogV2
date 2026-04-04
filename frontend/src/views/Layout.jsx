import React, { useState, useEffect } from 'react'; // Importamos useState y useEffect
import Navbar from '../components/Principal/Navbar'; 
import styles from '../styles/Layout.module.css';

const Layout = ({ children }) => {

    return (
        <div className={styles.view}>
            <Navbar />
            <div className={styles.main_content_wrapper}>
                {children}
            </div>
        </div>
    );
};

export default Layout;