import React, { useState, useEffect } from 'react';
import '../../styles/Home.css';
import { reportService } from '../../services/reportService';
import MapaLectura from '../Reportes/MapaLectura';

const HomeLogin = () => {
  const [busqueda, setBusqueda] = useState('');
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportService.getAllReports();
        setReportes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener reportes:', error);
        setReportes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const reportesFiltrados = reportes.filter(reporte =>
    reporte.type?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="cabecera-home">
        <button className="button-principal">
          Mis Reportes
        </button>
        <input
          type="text"
          className="input"
          placeholder="Buscar"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {loading && <div>Cargando reportes...</div>}
      {!loading && reportesFiltrados.length === 0 && (
        <div>No se encontraron reportes.</div>
      )}

      {!loading && reportesFiltrados.map((reporte, index) => (
        <a
          key={reporte._id || index}
          href={`/report_details?id=${reporte._id}`}
          className="preview-link-home"
        >
          <div className="preview-container-home">
            <div className="preview-columna-home">
              <div className="foto-container-home">
                <img
                  src={
                    Array.isArray(reporte.images) && reporte.images.length > 0
                      ? reporte.images[0]
                      : 'https://via.placeholder.com/150'
                  }
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
        </a>
      ))}
    </div>
  );
};

export default HomeLogin;
