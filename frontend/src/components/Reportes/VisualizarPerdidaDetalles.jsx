import React, { useEffect, useState } from 'react';
import '../../styles/VisualizarReportes.css';
import MapaLectura from '../../components/Reportes/MapaLectura';
import { reportService } from '../../services/reportService';

const VisualizarPerdidaDetalle = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener ID desde la URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const fetchReporte = async () => {
      try {
        const response = await reportService.getReportById(id);
        setReporte(response);
      } catch (error) {
        console.error('Error al cargar el reporte:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, []);

  if (loading) return <div className="visualizacion-container">Cargando reporte...</div>;

  if (!reporte) return <div className="visualizacion-container">Reporte no encontrado.</div>;

  return (
    <div className='visualizacion-container'>
      <div className='cabecera-visualizacion'>
        <a href='/home'>
          <span className='button-three'>Volver</span>
        </a>
      </div>
      <div className='reporte-perdida-container'>
        <div className='reporte-perdida-columna'>
          <div className='foto-reporte-container'>
            <img
              src={
                Array.isArray(reporte.images) && reporte.images.length > 0
                  ? reporte.images[0]
                  : 'https://via.placeholder.com/300'
              }
              className='foto-reporte'
              alt='Foto mascota'
            />
          </div>
          <div className='mapa-container'>
            <MapaLectura
              ubicacion={[
                reporte.location?.coordinates?.[1] || 4.612,
                reporte.location?.coordinates?.[0] || -74.07,
              ]}
              dragging={true}
            />
          </div>
        </div>
        <div className='reporte-perdida-columna'>
          <div className='titulo-reporte-perdida'>
            <h2>{reporte.type}</h2>
          </div>
          <div className='detalles-reporte-perdida'>
            <p>{reporte.description || 'Sin descripción'}</p>
          </div>
          <div className='div-botones-reporte-perdida'>
            <a href={`/create_seen?id=${reporte._id}`}>
              <span className='button-four'>Avistamiento</span>
            </a>
            <a href={`/create_found?id=${reporte._id}`}>
              <span className='button-principal'>Hallazgo</span>
            </a>
          </div>
          <div className='div-botones-reporte-perdida'>
            <a href='/home'>
              <span className='button-principal'>Eliminar</span>
            </a>
            <a href={`/edit_lost?id=${reporte._id}`}>
              <span className='button-four'>Editar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizarPerdidaDetalle;