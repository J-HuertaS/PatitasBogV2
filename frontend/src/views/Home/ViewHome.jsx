import { useEffect, useState } from "react";
import { reportService } from "../../services/reportService";
import HeroSection from "../../components/Home/HeroSection";
import ReportsTape from "../../components/Home/ReportsTape";
import styles from "../../styles/Home.module.css";

const ViewHome = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await reportService.getAllReports(4.7110, -74.0721, 5000);
        setReportes(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error al obtener reportes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.contentWrapper}>
        <HeroSection />
        <ReportsTape reportes={reportes} loading={loading} />  
      </div>

      <div className={styles.bottomNotice}>
        <p>Para ver más detalles e interactuar con los reportes debes iniciar sesión</p>
      </div>
    </div>
  );
};

export default ViewHome;
