import React, { useState, useEffect } from 'react';
import '../../styles/FormsReportes.css';
import MapaSelector from './MapaSelector';
import { responseService } from '../../services/responseService';

const FormEditarHallazgo = ({ onChangeSuccess, onChangeFail }) => {
  const tiporeporteInput = 'hallazgo';
  const [detallesInput, setDetallesInput] = useState('');
  const [ubicacionInput, setUbicacionInput] = useState(null);
  const [imagenInput, setImagenInput] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [responseId, setResponseId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id_rep = params.get('id');
    const id_resp = params.get('response');
    setReportId(id_rep);
    setResponseId(id_resp);

    if (!id_rep || !id_resp) return;

    const fetchData = async () => {
      try {
        const response = await responseService.getResponseById(id_rep, id_resp);

        setDetallesInput(response.comment || '');
        setUbicacionInput({
          lat: response.location.coordinates[1],
          lng: response.location.coordinates[0],
        });
        setImagenInput(response.images?.[0] || null);
      } catch (error) {
        console.error('Error al obtener el reporte:', error);
        onChangeFail('Error al cargar', 'No se pudo cargar la información del reporte.');
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      // Simulación de subida: solo se usa como preview (NO persistente)
      const previewUrl = URL.createObjectURL(file);
      setImagenInput(previewUrl);
    } else {
      alert('Por favor selecciona una imagen JPG o PNG.');
      e.target.value = null;
    }
  };

  const validateForm = () => {
    let currentErrors = [];
    let isValid = true;

    if (detallesInput === '') {
      currentErrors.push('El campo de detalles no puede estar vacío.');
      isValid = false;
    }
    if (ubicacionInput == null) {
      currentErrors.push('El campo de ubicación no puede estar vacío.');
      isValid = false;
    }
    return { isValid, errors: currentErrors.join('\n') };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateForm();

    if (!reportId || !responseId) {
      onChangeFail('Error crítico', 'Faltan los IDs necesarios.');
      return;
    }

    if (!isValid) {
      onChangeFail('Error en el formulario', errors);
      return;
    }

    const updatedResponse = {
      type: tiporeporteInput,
      comment: detallesInput,
      location: {
        type: 'Point',
        coordinates: [ubicacionInput.lng, ubicacionInput.lat],
      },
      images: imagenInput ? [imagenInput] : [],
    };

    try {
      await responseService.updateResponse(reportId, responseId, updatedResponse);
      onChangeSuccess(
        '¡Reporte actualizado correctamente!',
        'detalles de reporte',
        `/report_details?id=${reportId}`
      );
    } catch (error) {
      console.error('Error al actualizar el reporte:', error);
      onChangeFail(
        '¡Error al actualizar reporte!',
        'No se pudo actualizar el reporte. Intenta nuevamente.'
      );
    }
  };

  return (
    <div className="container-modulo-reportes">
      <div className="cabecera-container-reportes">
        <span className="spacer"></span>
        <span className="title"><h2>Editar Reporte</h2></span>
        <a href="/home"><span className="close">X</span></a>
      </div>

      <form onSubmit={handleSubmit} className="formulario-modulo-reportes">
        <div className="filas-container-reportes">
          <label>Tipo de Reporte</label>
          <span className="blocked-input">Hallazgo</span>
          <p className="behind-input"></p>
        </div>

        <label>Detalles*</label>
        <textarea
          className="textarea-reportes"
          value={detallesInput}
          onChange={(e) => setDetallesInput(e.target.value)}
          rows="5"
        />
        <p className="behind-input"></p>

        <div className="columnas-container-reportes">
          <div className="filas-container-reportes">
            <label>Ubicación*</label>
            <MapaSelector
              setUbicacion={setUbicacionInput}
              ubicacionInicial={ubicacionInput}
            />
            <p className="behind-input"></p>
          </div>

          <div className="filas-container-reportes">
            <label className="label-foto">Foto (JPG o PNG)</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="input-foto"
            />

            {imagenInput && (
              <img
                src={imagenInput}
                alt="Preview"
                className="preview-foto"
              />
            )}
          </div>
        </div>

        <div className="buttons-div-reportes">
          <a href="/home" className="button-secondary">Descartar</a>
          <button type="submit" className="button-principal">Guardar</button>
        </div>
      </form>

      <h3>Los campos señalados con * no pueden quedar vacíos</h3>
    </div>
  );
};

export default FormEditarHallazgo;