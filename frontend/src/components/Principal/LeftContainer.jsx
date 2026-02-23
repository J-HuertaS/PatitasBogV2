import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/LeftContainer.css';

const LeftContainer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useContext(AuthContext); // << usamos el estado global

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen]);

    const toggleLeftContainer = () => {
        setIsOpen(!isOpen);
    };

    // Si no hay token, no mostrar nada
    if (!isAuthenticated) return null;

    return (
        <>
            <button className="toggle-left-container-button" onClick={toggleLeftContainer} 
                aria-label="Abrir/Cerrar menú lateral">
                {isOpen ? '<' : '>'}
            </button>

            <div className={`left-container ${isOpen ? 'open' : ''}`}>
                <div className="icono-container">
                    <a href="/notifications">
                        <img src='/images/campana.png' className="icono-image" 
                        alt="campana de notificaciones" />                
                    </a>
                </div>
                <div className="profile-picture-container">
                    <a href="/my_profile">
                        <img src='/images/fotodeperfil.png' className="profile-picture"
                        alt="foto de perfil" />                
                    </a>
                </div>
            </div>
        </>
    );
};

export default LeftContainer;
