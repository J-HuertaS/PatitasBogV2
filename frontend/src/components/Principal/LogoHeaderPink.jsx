import { Link } from "react-router-dom"
import styles from "../../styles/Principal.module.css"

const LogoHeaderPink = () => (
  <Link to="/" className={styles.patitasLogoSection}>
    <img src="/images/logo.svg" alt="Logo" className={styles.logoIcon} />
    <span className={styles.logoText2}>PatitasBog</span>
  </Link>
)

export default LogoHeaderPink