import React, { useState, useEffect, useContext } from 'react'; 
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/RightContainer.css';

const RightContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const toggleRightContainer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button className="toggle-right-container-button" onClick={toggleRightContainer} aria-label="Abrir/Cerrar menú lateral">
        {isOpen ? 'X' : '☰'}
      </button>

      <div className={`right-container ${isOpen ? 'open' : ''}`}>
        <div className="contact">
          <h2>Contactos</h2>
          <span>Email: servicio@patitasbog.com<br /></span>
          <span>Tel: 3333333333</span>
        </div>

        <div className="call-to-action">
          <a href="/education" className='call-to-action-redirect'>
            <h2>Módulo Educativo</h2>
            <img src="/images/moduloeducativo.PNG" alt="Módulo educativo" className="imagen-previa" />
          </a>
        </div>

        {isAuthenticated && (
          <div className="create-report-redirect">
            <a href="/create_lost" className="report-link">
              <img src="/images/lapiz_icono.png" alt="Ícono de lápiz" className="icono-boton" />
              <h2>Nuevo Reporte</h2>
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default RightContainer;
