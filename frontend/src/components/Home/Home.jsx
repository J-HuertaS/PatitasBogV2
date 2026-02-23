import React, { useState, useEffect } from 'react';
import '../../styles/Home.css';
import MapaLectura from '../Reportes/MapaLectura';
import { reportService } from '../../services/reportService';

const Home = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await reportService.getAllReports();
        console.log('Reportes recibidos:', response);
        setReportes(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error al obtener reportes:', error);
        setReportes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="home-container">
      {loading ? (
        <div>Cargando reportes...</div>
      ) : (
        reportes.map((reporte, index) => (
          <div className="preview-container-home" key={reporte._id || index}>
            <div className="preview-columna-home">
              <div className="foto-container-home">
                <img
                  src={reporte.images[0] || 'https://via.placeholder.com/150'}
                  alt={reporte.type || 'Mascota'}
                  className="preview-foto-home"
                />
              </div>
            </div>
            <div className="preview-columna-home-alterna">
              <div className="texto-preview-home">
                <h2>{reporte.type}</h2>
                <p>{reporte.description || 'Sin detalles'}</p>
              </div>
              <div className="mapa-preview-home">
                <MapaLectura
                  ubicacion={[
                    reporte.location?.coordinates?.[1] || 4.612,
                    reporte.location?.coordinates?.[0] || -74.07,
                  ]}
                  dragging={false}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
