import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "../../styles/SignUp.module.css"
import SignUpOptions from "../../components/Register/SignUpOptions"
import SignUpEmailForm from "../../components/Register/SignUpEmailForm"
import LogoHeader from "../../components/Principal/LogoHeaderBrown"


const ViewSignUp = ({ onRegister, onFail }) => {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [googleError, setGoogleError] = useState("")

  const handleShowEmailForm = () => {
    setShowEmailForm(!showEmailForm)
  }
  
  return (
    <div className={styles.patitasContainer}>
          <LogoHeader />
          {!showEmailForm && ( 
            <SignUpOptions handleShowEmailForm={handleShowEmailForm} setGoogleError={setGoogleError}/>
          )} 
          {showEmailForm && (
            <SignUpEmailForm 
              handleShowEmailForm={handleShowEmailForm}
              setGoogleError={setGoogleError}
              onRegister={onRegister}
              onFail={onFail}
            />
          )}  
          <div className={styles.patitasSigninSection}>
            <p className={styles.patitasSigninText}>
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className={styles.patitasSigninLink}>
                Inicia Sesión
              </Link>
            </p>
          </div>
    </div>
  )
}

export default ViewSignUp;