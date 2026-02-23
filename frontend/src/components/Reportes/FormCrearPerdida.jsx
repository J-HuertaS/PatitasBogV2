import React, { useState } from 'react';
import '../../styles/FormsReportes.css';
import MapaSelector from './MapaSelector';
import { reportService } from '../../services/reportService'; // ✅ Correcto

const FormCrearPerdida = ({ onChangeSuccess, onChangeFail }) => {
  const tiporeporteInput = 'Perdida';
  const [tipomascotaInput, setTipoMascotaInput] = useState('');
  const [detallesInput, setDetallesInput] = useState('');
  const [ubicacionInput, setUbicacionInput] = useState(null);
  const [imagenInput, setImagenInput] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setImagenInput(file);
    } else {
      alert("Por favor selecciona una imagen JPG o PNG.");
      e.target.value = null;
    }
  };

  const validateForm = () => {
    let currentErrors = [];
    let isValid = true;

    if (tipomascotaInput === '') {
      currentErrors.push('El campo de tipo de mascota no puede estar vacío.');
      isValid = false;
    }
    if (detallesInput === '') {
      currentErrors.push('El campo de detalles no puede estar vacío.');
      isValid = false;
    }
    if (ubicacionInput == null) {
      currentErrors.push('El campo de ubicación no puede estar vacío.');
      isValid = false;
    }
    if (imagenInput == null) {
      currentErrors.push('El campo de foto no puede estar vacío.');
      isValid = false;
    }

    return { isValid, errors: currentErrors.join('\n') };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm();

    if (isValid) {
      try {
        setIsSubmitting(true);

        const reportData = {
          type: tipomascotaInput, 
          description: detallesInput,
          location: {
            type: 'Point',
            coordinates: [ubicacionInput.lng, ubicacionInput.lat], 
          },
          images: ['/images/foto_mascota.png'], 
        };

        const response = await reportService.createReport(reportData);
        console.log('Reporte creado:', response);

        onChangeSuccess('¡Reporte creado correctamente!', 'inicio', '/home');
      } catch (error) {
        onChangeFail(
          'Error al crear reporte',
          error?.response?.data?.message || error.message
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setTimeout(() => {
        onChangeFail('¡Error al crear reporte!', errors);
      }, 500);
    }
  };

  return (
    <div className='container-modulo-reportes'>
      <div className='cabecera-container-reportes'>
        <span className='spacer'></span>
        <span className='title'><h2>Crear Reporte</h2></span>
        <a href='/home'><span className='close'>X</span></a>
      </div>

      <form onSubmit={handleSubmit} className='formulario-modulo-reportes'>
        <div className='columnas-container-reportes'>
          <div className='filas-container-reportes'>
            <label>Tipo de Reporte</label>
            <span className='blocked-input'>{tiporeporteInput}</span>
            <p className='behind-input'></p>
          </div>

          <div className='filas-container-reportes'>
            <label>Tipo de Mascota*</label>
            <select
              value={tipomascotaInput}
              onChange={(e) => setTipoMascotaInput(e.target.value)}
            >
              <option value="">Seleccione una opción</option>
              <option value="perro">perro</option>
              <option value="gato">gato</option>
              <option value="otro">otro</option>
            </select>
            <p className='behind-input'></p>
          </div>
        </div>

        <label>Detalles*</label>
        <textarea
          className='textarea-reportes'
          value={detallesInput}
          onChange={(e) => setDetallesInput(e.target.value)}
          rows="5"
        />
        <p className='behind-input'></p>

        <div className='columnas-container-reportes'>
          <div className='filas-container-reportes'>
            <label>Ubicación*</label>
            <MapaSelector setUbicacion={setUbicacionInput} ubicacionInicial={ubicacionInput} />
            <p className='behind-input'></p>
          </div>

          <div className='filas-container-reportes'>
            <label className="label-foto">Foto (JPG o PNG)*</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="input-foto"
            />
            {imagenInput && (
              <img
                src={URL.createObjectURL(imagenInput)}
                alt="Preview"
                className="preview-foto"
              />
            )}
          </div>
        </div>

        <div className='buttons-div-reportes'>
          <a href='/home' className='button-secondary'>Descartar</a>
          <button type="submit" className="button-principal" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </form>

      <h3>Los campos señalados con * no pueden quedar vacíos</h3>
    </div>
  );
};

export default FormCrearPerdida;
