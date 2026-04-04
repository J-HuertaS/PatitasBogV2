"use client"
import { Link } from "react-router-dom"
import styles from "../../styles/HomeLoggedIn.module.css"

const ReportButtons = ({ showMyReportsOnly, toggleMyReports }) => {
  return (
    <div className={styles.reportButtonsContainer}>
      {/* "Mis Reportes" is now a button that toggles a filter */}
      <button
        onClick={toggleMyReports}
        className={`${styles.reportButton} ${showMyReportsOnly ? styles.reportButtonActive : ""}`}
      >
        Mis Reportes
      </button>
      {/* "Crear Reporte" remains a navigation link */}
      <Link to="/create-report" className={styles.reportButtonPrimary}>
        Crear Reporte
      </Link>
    </div>
  )
}

export default ReportButtons
