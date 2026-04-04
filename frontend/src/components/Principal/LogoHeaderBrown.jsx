import { Link } from "react-router-dom"
import styles from "../../styles/Principal.module.css"

const LogoHeaderBrown = () => (
  <Link to="/" className={styles.patitasLogoSection}>
    <img src="/images/logo2.svg" alt="Logo" className={styles.logoIcon} />
    <span className={styles.logoText}>PatitasBog</span>
  </Link>
)

export default LogoHeaderBrown
