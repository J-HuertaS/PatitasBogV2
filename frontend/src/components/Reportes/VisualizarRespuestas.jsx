import React from 'react';
import '../../styles/PreviewReporte.css';
import MapaLectura from './MapaLectura';

const VisualizarRespuestas = ({ type, comment, images, location, id_reporte, id_respuesta }) => {
  const editRoute =
    type === 'hallazgo' ? 'edit_found' :
    type === 'avistamiento' ? 'edit_seen' :
    null;

  return (
    <div className='preview-container'>
      <div className='preview-columna'>
        <div className='left-preview-container'>
          <MapaLectura
            ubicacion={[
              location?.coordinates?.[1] || 4.612,
              location?.coordinates?.[0] || -74.07,
            ]}
            dragging={true}
          />
        </div>
      </div>

      <div className='preview-columna-altern'>
        <div className='texto-preview'>
          <p>Tipo: {type}</p>
          <p>{comment}</p>
        </div>

        <div className='container-button-picture-preview'>
          <div className='right-preview-container'>
            <img
              src={images[0] || 'https://via.placeholder.com/150'}
              className='foto-preview'
              alt='Foto respuesta'
            />
          </div>

          <div className='div-buttons-preview'>
            {editRoute && (
              <a
                href={`/${editRoute}?id=${id_reporte}&response=${id_respuesta}`}
                className='button-four'
              >
                Editar
              </a>
            )}
            <span className='button-principal'>Eliminar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizarRespuestas;
