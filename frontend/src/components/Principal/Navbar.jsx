"use client"

import { useContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "../../styles/Navbar.module.css" 
import { AuthContext } from "../../contexts/AuthContext"

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1280) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <nav className={styles.navbar}>
        
        <Link to={isAuthenticated ? "/home" : "/"} className={styles.logoSection} onClick={closeMobileMenu}>
          <img src="/images/logo.svg" alt="Logo" className={styles.logoIcon} />
          <span className={styles.logoText}>PatitasBog</span>
        </Link>


        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          <Link to="/about">Quiénes Somos</Link>
          <Link to="/education">Módulo Educativo</Link>
          {!isAuthenticated && (
            <>
              <Link to="/register">Registrarse</Link>
              <Link to="/login">Iniciar Sesión</Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link to="/notificaciones">Notificaciones</Link>
              <Link to="/perfil">Mi Perfil</Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>

        {/* Hamburger Button */}
        <button
          className={`${styles.hamburgerBtn} ${isMobileMenuOpen ? styles.open : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.open : ""}`}>
        <div className={styles.mobileNavLinks}>
          <Link to="/about" onClick={closeMobileMenu}>
            Quiénes Somos
          </Link>
          <Link to="/education" onClick={closeMobileMenu}>
            Módulo Educativo
          </Link>
          {!isAuthenticated && (
            <>
              <Link to="/register" onClick={closeMobileMenu}>
                Registrarse
              </Link>
              <Link to="/login" onClick={closeMobileMenu}>
                Iniciar Sesión
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link to="/notificaciones" onClick={closeMobileMenu}>
                Notificaciones
              </Link>
              <Link to="/perfil" onClick={closeMobileMenu}>
                Mi Perfil
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
