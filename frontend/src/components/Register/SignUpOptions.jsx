import { useState, useContext } from "react";
import styles from "../../styles/SignUp.module.css";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { userService } from "../../services/userService";
import { AuthContext } from "../../contexts/AuthContext";

const SignUpOptions = ({ handleShowEmailForm }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setGoogleError("");

    try {
      const response = await userService.googleLogin({
        id_token: credentialResponse.credential,
      });

      if (response.token) {
        login(response.token);
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      if (error.message === "Network Error") {
        setGoogleError("No se pudo conectar con el servidor.");
      } else if (error.response?.data?.message) {
        setGoogleError(error.response.data.message);
      } else {
        setGoogleError("Ocurrió un error inesperado.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setGoogleError("Error al iniciar sesión con Google.");
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
    flow: "implicit",
  });

  return (
    <div className={styles.patitasMainCard}>
      <div className={styles.patitasCardContent}>
        <h2 className={styles.patitasMainTitle}>Regístrate</h2>
        <p className={styles.patitasSubtitle}>Hazlo gratis. No se requiere ningún pago</p>
        <hr className={styles.patitasDivider} />

        <div className={styles.patitasButtonsSection}>
          <button
            className={`${styles.patitasButton} ${styles.patitasGoogleButton}`}
            onClick={() => loginGoogle()}
            disabled={isLoading}
          >
            <img src="/icons/google_icon.png" alt="Google" width="22" height="22" />
            <span className={styles.fullText}>
              {isLoading ? "Conectando..." : "Continuar con Google"}
            </span>
            <span className={styles.shortText}>Google</span>
          </button>

          <button
            className={`${styles.patitasButton} ${styles.patitasEmailButton}`}
            onClick={handleShowEmailForm}
          >
            <img src="/icons/mail.svg" alt="Email" width="22" height="22" />
            <span className={styles.fullText}>Continuar con correo</span>
            <span className={styles.shortText}>Correo</span>
          </button>
        </div>

        {googleError && <div className={styles.patitasErrorMessage}>{googleError}</div>}

        <div className={styles.patitasTermsSection}>
          <p className={styles.patitasTermsText}>
            Al registrarte aceptas los{" "}
            <a href="#" className={styles.patitasTermsLink}>Términos</a> y las{" "}
            <a href="#" className={styles.patitasTermsLink}>Políticas de Privacidad</a>
          </p>
        </div>

        <div className={styles.patitasUniversitySection}>
          <p className={styles.patitasUniversityText}>
            Este es un proyecto realizado en la clase Ingeniería de Software 2,
            de la Universidad Nacional de Colombia en el semestre 2025-1
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpOptions;
