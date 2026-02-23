import React, { useState } from 'react'; 
import '../../styles/MenuPerfil.css';
import apiService from '../../services/apiService';

// Componente para editar el perfil del usuario
const FormPerfilEditar = ({
  nombre,
  email,
  usuario,
  genero,
  direccion,
  telefono,
  onChangeSuccess,
  onChangeFail
}) => {
  // Estados locales para los campos editables del perfil
  const [nombreInput, setNombreInput] = useState(nombre);
  const [usuarioInput, setUsuarioInput] = useState(usuario);
  const [generoInput, setGeneroInput] = useState(genero);
  const [direccionInput, setDireccionInput] = useState(direccion);
  const [telefonoInput, setTelefonoInput] = useState(telefono);
  const [isLoading, setIsLoading] = useState(false);

  // Función para validar los campos obligatorios antes de enviar
  const validateForm = () => {
    let currentErrors = []; 
    let isValid = true;   

    // Valida que el nombre no esté vacío
    if (nombreInput === '') {
      currentErrors.push('El campo de nombre no puede estar vacío.');
      isValid = false;
    }
    // Valida que el usuario no esté vacío
    if (usuarioInput === '') {
      currentErrors.push('El campo de usuario no puede estar vacío.');
      isValid = false;
    }
    return { isValid, errors: currentErrors.join('\n') };
  };

  // Maneja el envío del formulario para actualizar el perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm();

    // Si la validación es exitosa, llama a la API
    if (isValid) {
      setIsLoading(true);
      try {
        // Llama a la API para actualizar el perfil con los datos actuales
        await apiService.updateProfile({
          nombre: nombreInput,
          usuario: usuarioInput,
          genero: generoInput,
          direccion: direccionInput,
          telefono: telefonoInput
        });
        // Si todo sale bien, muestra mensaje de éxito
        onChangeSuccess(
          '¡Datos actualizados correctamente!',
          'perfil',
          'my_profile'
        );
      } catch (error) {
        // Si hay error, muestra mensaje de error
        onChangeFail(
          '¡Error al actualizar los datos de perfil!',
          error.message || 'Error desconocido'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // Si la validación falla, muestra mensaje de error
      onChangeFail(
        '¡Error al actualizar los datos de perfil!',
        errors
      );
    }
  };

  return (
    <div className='container-seccion-perfil'>
      {/* Cabecera del formulario con título y botón de cerrar */}
      <div className='cabecera-container-perfil'>
        <span className='spacer'></span>
        <span className='title'><h2>Perfil</h2></span>
        <a href='/home'><span className='close'>X</span></a>
      </div>
      {/* Formulario de edición de perfil */}
      <form onSubmit={handleSubmit}>
        <div className='columnas-container-perfil'>
          {/* Primera columna de campos */}
          <div className='filas-container-perfil'>
            <label>Nombre*</label>
            <input
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              type="text"
            />
            <p className='behind-input'></p>
            <label>Usuario*</label>
            <input
              value={usuarioInput}
              onChange={(e) => setUsuarioInput(e.target.value)}
              type="text"
            />
            <p className='behind-input'></p>
            <label>Dirección</label>
            <input
              value={direccionInput}
              onChange={(e) => setDireccionInput(e.target.value)}
              type="text"
            />
            <p className='behind-input'></p>
            {/* Botón para descartar cambios y volver al perfil */}
            <a href='/my_profile' className='button-secondary'>Descartar</a>
          </div>
          {/* Segunda columna de campos */}
          <div className='filas-container-perfil'>
            <label>Correo</label>
            {/* El correo no es editable */}
            <span className='blocked-input'>{email}</span>
            <p className='behind-input'></p>
            <label>Género</label>
            <input
              value={generoInput}
              onChange={(e) => setGeneroInput(e.target.value)}
              type="text"
            />
            <p className='behind-input'></p>
            <label>Número de teléfono</label>
            <input
              value={telefonoInput}
              onChange={(e) => setTelefonoInput(e.target.value)}
              type="text"
            />
            <p className='behind-input'></p>
            {/* Botón para guardar los cambios */}
            <button type="submit" className="button-principal" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </form>
      {/* Nota sobre los campos obligatorios */}
      <h3>Los campos señalados con * no pueden quedar vacíos</h3>
    </div>
  );
};

export default FormPerfilEditar;