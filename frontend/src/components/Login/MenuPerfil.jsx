import React, { useState } from 'react'; 
import '../../styles/MenuPerfil.css';

const MenuPerfil = ({nombre, email, usuario, genero, direccion, telefono}) => {

    return (
        <div className='container-seccion-perfil'>
            <div className='cabecera-container-perfil'>
                <span className='spacer'></span>
                <span className='title'><h2>Perfil</h2></span>
                <a href='/home'><span className='close'>X</span></a>
            </div>
            <div className='columnas-container-perfil'>
                <div className= 'filas-container-perfil'>
                    <div className="profile-picture-container-view">
                        <img src='/images/fotodeperfil.png' className="profile-picture-view"
                        alt="foto de perfil" />                
                    </div>
                    <a href='/my_profile/picture' className='button-secondary'>Subir foto</a>
                    <a href='/my_profile/edit' className='button-three'>Modificar datos</a>
                    <a href='/my_profile/change_password' className='button-principal'>Cambiar contraseña</a>
                </div>
                <div className= 'filas-container-perfil'>
                    <h3>Nombre</h3>
                    <span className='blocked-input'>{nombre}</span>
                    <h3>Correo</h3>
                    <span className='blocked-input'>{email}</span>
                    <h3>Usuario</h3>
                    <span className='blocked-input'>{usuario}</span>
                    <h3>Género</h3>
                    <span className='blocked-input'>{genero}</span>
                    <h3>Dirección</h3>
                    <span className='blocked-input'>{direccion}</span>
                    <h3>Número de teléfono</h3>
                    <span className='blocked-input'>{telefono}</span>
                </div>
            </div>
        </div>
    );
};

export default MenuPerfil;