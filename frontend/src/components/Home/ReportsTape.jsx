import { motion } from "framer-motion";
import PetCard from "./PetCard";
import styles from "../../styles/Home.module.css";

const ReportsTape = ({ reportes, loading }) => {
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Cargando reportes...</p>
            </div>
        );
    }

    if (reportes.length === 0) {
        return (
            <div className={styles.noResultsContainer}>
                <h3>No hay reportes disponibles</h3>
                <p>Vuelve pronto para ver nuevos reportes de mascotas</p>
            </div>
        );
    }

    const duplicatedReportes = [...reportes, ...reportes];

    return (
        <div className={styles.reportsTapeSection}>
            <div className={styles.tapeContainer}>
                <motion.div
                    className={styles.tapeScroller}
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 150, ease: "linear" }}
                >
                    <div className={styles.infiniteTape}>
                        {duplicatedReportes.map((reporte, index) => (
                            <PetCard key={`${reporte.id || index}-${index}`} reporte={reporte} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
  );
};

export default ReportsTape;
