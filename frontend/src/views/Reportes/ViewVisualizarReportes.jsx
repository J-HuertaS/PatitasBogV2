import React, { useEffect, useState } from 'react';
import VisualizarPerdidaDetalles from '../../components/Reportes/VisualizarPerdidaDetalles';
import VisualizarRespuestas from '../../components/Reportes/VisualizarRespuestas';
import { responseService } from '../../services/responseService';

const ViewEditarPerdida = () => {
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idReporte, setIdReporte] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setIdReporte(id);

    const fetchRespuestas = async () => {
      try {
        const response = await responseService.getResponsesByReportId(id);
        console.log(response);
        setRespuestas(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error obteniendo respuestas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRespuestas();
  }, []);

  return (
    <div className='generic-container'>
      <VisualizarPerdidaDetalles />
      {!loading && respuestas.map((respuesta) => (
        <VisualizarRespuestas
          key={respuesta.id}
          type={respuesta.type}
          comment={respuesta.comment || 'Sin descripción'}
          images={respuesta.images}
          location={respuesta.location}
          id_reporte={idReporte}
          id_respuesta={respuesta.id}
        />
      ))}
    </div>
  );
};

export default ViewEditarPerdida;
