import {React,useState} from 'react'; 
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Bienvenida from '../../components/Login/Bienvenida'
import FormRecuperacion from '../../components/Login/FormRecuperacion';
import Success from '../../components/Principal/Success';
import Fail from '../../components/Principal/Fail';

const ViewRecuperarClave = () => {
        const navigate = useNavigate(); // Hook para navegación
        const [showSuccessPopup, setShowSuccessPopup] = useState(false);
        const [titleSuccess, setTitleSuccess] = useState('');  
        const [endSuccess, setEndSuccess] = useState('');     
        const [redirectSuccess, setRedirectSuccess] = useState(''); 
    
        const handleChangeSuccess = (type, data) => { // Modificar para manejar diferentes tipos de éxito
            if (type === 'show_reset_form') {
                // Redirigir a la vista de cambiar contraseña, pasando el email como estado
                navigate('/change_password', { state: { email: data } });
            } else {
                // Lógica anterior para popups de éxito genéricos
                setTitleSuccess(type); // Asumiendo que type es el título en este caso
                setEndSuccess(data);   // Asumiendo que data es el mensaje final
                // setRedirectSuccess(redirect); // Considerar cómo manejar el redirect aquí
                setShowSuccessPopup(true);
            }
        };
    
        const [showFailPopup, setShowFailPopup] = useState(false);
        const [titleFail, setTitleFail] = useState('');  
        const [bodyFail, setBodyFail] = useState('');      
    
        const handleChangeFail= (title, body) => {
            setTitleFail(title);
            setBodyFail(body);
            setShowFailPopup(true);
        };

    return (
        <div className='generic-container'>
            <Bienvenida />
            <FormRecuperacion onChangeSuccess={handleChangeSuccess}
                onChangeFail={handleChangeFail}/>
            {showSuccessPopup && (
                <Success
                    title={titleSuccess}
                    end={endSuccess}
                    redirect={redirectSuccess}
                />
            )}
            {showFailPopup && (
                <Fail
                    setShowFailPopup={setShowFailPopup}
                    title={titleFail}
                    body={bodyFail}
                />
            )}
        </div>
    );
};

export default ViewRecuperarClave;