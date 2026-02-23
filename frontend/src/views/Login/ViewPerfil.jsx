import React, { useState } from 'react';
import MenuPerfil from '../../components/Login/MenuPerfil'

const ViewPerfil = () => {
    const nombre='Juan Pérez';
    const email='juan@ejemplo.com';
    const usuario='juanperez';
    const genero='Masculino';
    const direccion='Calle Falsa 123, Ciudad';
    const telefono='+1234567890';

    return (
        <div className='generic-container'>
            <MenuPerfil nombre={nombre}
                email={email}
                usuario={usuario}
                genero={genero}
                direccion={direccion}
                telefono={telefono}
            />
        </div>
    );
};

export default ViewPerfil;