import { useState } from "react"
import { Link, useNavigate} from "react-router-dom"
import apiService from "../../services/apiService"
import styles from "../../styles/SignUp.module.css"
import { validarCorreo, validarPassword, getPasswordValidations } from "../../utils/usuariosUtils"

const SignUpEmailForm = ({ onRegister, onFail, handleShowEmailForm, setGoogleError }) => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [password, setPassword] = useState("")
    const [confirmarPassword, setConfirmarPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formError, setFormError] = useState("")  

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage("")
        setSuccessMessage("")

        if (!nombre || !correo || !password || !confirmarPassword) {
            setErrorMessage("No es posible registrarse porque... Algún campo está vacío")
            setIsLoading(false)
            if (onFail) onFail("No es posible registrarse", "Algún campo está vacío")
            return
        }

        if (!validarCorreo(correo)) {
            setErrorMessage("No es posible registrarse porque... El correo no tiene un formato válido")
            setIsLoading(false)
            if (onFail) onFail("No es posible registrarse", "El correo no tiene un formato válido")
            return
        }

        if (!validarPassword(password)) {
            setErrorMessage("No es posible registrarse porque... La contraseña no cumple los estándares")
            setIsLoading(false)
            if (onFail) onFail("No es posible registrarse", "La contraseña no cumple los estándares")
            return
        }

        if (password !== confirmarPassword) {
            setErrorMessage("No es posible registrarse porque... La confirmación no coincide con la contraseña")
            setIsLoading(false)
            if (onFail) onFail("No es posible registrarse", "La confirmación no coincide con la contraseña")
            return
        }

        try {
            const userData = {
                full_name: nombre,
                email: correo,
                password,
            }

            const response = await apiService.register(userData)

            setSuccessMessage("¡Cuenta creada con éxito! Redirigiendo a login...")

            if (onRegister) {
                onRegister("¡Cuenta creada con éxito!", "Redirigiendo a login...", "/login");
            }

            setTimeout(() => {
                navigate("/login");
            }, 1500);
            
        } catch (error) {
            setErrorMessage("No es posible registrarse porque... " + (error.message || "Error desconocido"))
            if (onFail) {
                onFail("No es posible registrarse", error.message || "Error desconocido")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoBack = () => {
        handleShowEmailForm()
        setGoogleError("")
        setFormError("")
    }

    const validaciones = getPasswordValidations(password, confirmarPassword)
    
    return (
        <div className={styles.patitasMainCard}>
            <div className={styles.patitasCardContent}>
                <div className={styles.patitasTitleSection}>
                    <h2 className={styles.patitasMainTitle}>Registrate</h2>
                    <p className={styles.patitasSubtitle}>Hazlo gratis. No se requiere ningún pago</p>
                </div>
                <hr className={styles.patitasDivider} />
                <form onSubmit={handleSubmit} className={styles.patitasEmailForm}>
                    {/* Nombre completo */}
                    <div className={styles.patitasFormFieldSingle}>
                        <label className={styles.patitasFormLabel}>Nombre completo</label>
                        <input
                            type="text"
                            className={styles.patitasFormInputSingle}
                            placeholder="Ingresa tu nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        required
                        />
                    </div>
                    {/* Correo electrónico */}
                    <div className={styles.patitasFormFieldSingle}>
                        <label className={styles.patitasFormLabel}>Correo electrónico</label>
                        <input
                            type="email"
                            className={styles.patitasFormInputSingle}
                            placeholder="Tu correo electrónico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    {/* Contraseña */}
                    <div className={styles.patitasFormFieldSingle}>
                        <label className={styles.patitasFormLabel}>Contraseña</label>
                        <div className={styles.patitasPasswordContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={styles.patitasFormInputSingle}
                                placeholder="Escribe una contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className={styles.patitasPasswordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <img
                                    src={showPassword ? "/icons/closed_eye.svg" : "/icons/open_eye.svg"}
                                    alt={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    width="20"
                                    height="20"
                                />
                            </button>
                        </div>
                        {/* Validaciones visuales */}
                        <div className={styles.patitasValidationChecks}>
                            <div className={`${styles.patitasValidationItem} ${validaciones.longitud ? styles.valid : ""}`}>
                                <span className={styles.patitasCheckIcon}>{validaciones.longitud ? "✓" : "○"}</span>
                                <span>Incluye 6 caracteres</span>
                            </div>
                            <div className={`${styles.patitasValidationItem} ${validaciones.mayuscula ? styles.valid : ""}`}>
                                <span className={styles.patitasCheckIcon}>{validaciones.mayuscula ? "✓" : "○"}</span>
                                <span>Incluye una mayúscula</span>
                            </div>
                            <div className={`${styles.patitasValidationItem} ${validaciones.minuscula ? styles.valid : ""}`}>
                                <span className={styles.patitasCheckIcon}>{validaciones.minuscula ? "✓" : "○"}</span>
                                <span>Incluye una minúscula</span>
                            </div>
                            <div className={`${styles.patitasValidationItem} ${validaciones.numero ? styles.valid : ""}`}>
                                <span className={styles.patitasCheckIcon}>{validaciones.numero ? "✓" : "○"}</span>
                                <span>Incluye un número</span>
                            </div>
                        </div>
                    </div>
                    {/* Confirmación de contraseña */}
                    <div className={styles.patitasFormFieldSingle}>
                        <label className={styles.patitasFormLabel}>Confirmación de contraseña</label>
                        <div className={styles.patitasPasswordContainer}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={styles.patitasFormInputSingle}
                                placeholder="Confirma tu contraseña"
                                value={confirmarPassword}
                                onChange={(e) => setConfirmarPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className={styles.patitasPasswordToggle}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <img
                                    src={showConfirmPassword ? "/icons/closed_eye.svg" : "/icons/open_eye.svg"}
                                    alt={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    width="20"
                                    height="20"
                                />
                            </button>
                        </div>
                        {/* Validación de coincidencia */}
                        {confirmarPassword && (
                            <div className={`${styles.patitasValidationItem} ${validaciones.coincide ? styles.valid : ""}`}>
                                <span className={styles.patitasCheckIcon}>{validaciones.coincide ? "✓" : "○"}</span>
                                <span>Coincide con la contraseña ingresada</span>
                            </div>
                        )}
                    </div>
                    {errorMessage && <div className={styles.patitasErrorMessage}>{errorMessage}</div>}
                    {successMessage && <div className={styles.patitasSuccessMessage}>{successMessage}</div>}
                    <button type="submit" className={styles.patitasCreateAccountBtn} disabled={isLoading}>
                        {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                    </button>
                    <div className={styles.oSeparator}>
                        <span className={styles.horizontalLine}></span>
                        <p className={styles.o}>ó</p>
                        <span className={styles.horizontalLine}></span>
                    </div>

                    <div className={styles.backTextContainer}>
                        <span className={styles.backText} onClick={handleGoBack}>
                            Volver a opciones de registro
                        </span>
                    </div>
                </form>
                <div className={styles.patitasUniversitySection}>
                    <p className={styles.patitasUniversityText}>
                        Este es un proyecto realizado en la clase Ingeniería de Software 2, de
                    <br />
                        la Universidad Nacional de Colombia en el semestre 2025-1
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUpEmailForm;