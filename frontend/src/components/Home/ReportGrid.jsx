"use client"
import PetCard from "./PetCard"
import styles from "../../styles/HomeLoggedIn.module.css"
import { Link } from "react-router-dom"

const ReportGrid = ({ reports, currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles.reportsGridContainer}>
      {reports.length === 0 ? (
        <div className={styles.noResultsContainer}>
          <h3>No se encontraron reportes</h3>
          <p>Intenta ajustar los filtros para ver más resultados</p>
        </div>
      ) : (
        <div className={styles.reportsGrid}>
          {reports.map((reporte) => (
            <Link key={reporte.id} to={`/reportes/${reporte.id}`} style={{ textDecoration: "none" }}>
              <PetCard reporte={reporte} />
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.paginationControls}>
          <button
            className={styles.paginationButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            Anterior
          </button>
          <span className={styles.pageNumber}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            className={styles.paginationButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Página siguiente"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

export default ReportGrid
