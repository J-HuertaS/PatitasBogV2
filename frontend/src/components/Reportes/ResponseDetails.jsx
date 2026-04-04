import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import styles from '../../styles/DetailsReport.module.css';
import MapaLectura from './MapaLectura';
import { userService } from '../../services/userService';
import { reputationService } from '../../services/reputationService';
import { responseService } from '../../services/responseService';

const ResponseDetails = ( { data, idviewer, idreport, report } ) => {
    const [idresponse, setIdReponse] = useState('');
    const navigate = useNavigate();
    const [like_clicked, setLike_Clicked] = useState(false);
    const [dislike_clicked, setDislike_Clicked] = useState(false);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [comment, setComment] = useState('');
    const [location, setLocation] = useState(null);
    const [petphoto, setPetPhoto] = useState('/images/sin_foto_mascota');
    const [nombre, setNombre] = useState('');
    const [idresponseUser, setIdResponseUser] = useState('');
    const [user, setUser] = useState('');
    const [userphoto, setUserPhoto] =useState('');
    const [type, setType] = useState('');
    const [reputation, setReputation] = useState('');
    const [loading, setLoading] = useState('');
    const [errormessage, setErrorMessage] = useState('');
    const [successmessage, setSuccessMessage] = useState('');

    useEffect(()=>{
        const fechaHora = data.created_at;
        const [fecha, horaCompleta] = fechaHora.split("T");
        const hora = horaCompleta.slice(0, 5);
        setDate(fecha);
        setTime(hora);
        setComment(data.comment);
        setLocation(data.location);
        setPetPhoto(data.photo);
        setType(data.type);
        setIdReponse(data.id)
        console.log("id de respuesta");
        console.log(data.id);

        const fetchUser = async () => {
            try{
                const response = await userService.getUserById(data.resp_user_id);
                setUser(response.user.username);
                setNombre(response.user.full_name);
                setReputation(response.user.reputation);
                setUserPhoto(response.user.profile_picture);
                setIdResponseUser(response.user.id);
                console.log(idresponseUser);
            }
            catch(error){
                setErrorMessage(`Error obteniendo datos del usuario creador de la respuesta: ${error.message}`);
            }
            finally{
                setLoading(false);
            }
        }

        fetchUser();
        
    }, [])

    const handle_like_click = async () => {
        setLike_Clicked(!like_clicked);
        setDislike_Clicked(false);
        console.log(idreport);
        console.log(idresponse);
        const respuesta = await reputationService.rateResponse(idreport, idresponse, "useful");
        console.log(respuesta);
    }

    const handle_dislike_click = async () => {
        
        setDislike_Clicked(!dislike_clicked);
        setLike_Clicked(false);
        if(type=="avistamiento"){
             const respuesta = await reputationService.rateResponse(idreport, idresponse, "not_useful");
             console.log(respuesta);
        }
         else{
            const respuesta = await reputationService.rateResponse(idreport, idresponse, "false_finding");
            console.log(respuesta);
        }
    }

    const handleDelete = async () => {
        setLoading(true);
        try{
            const response4 = await responseService.deleteResponse(idreport, idresponse);
            console.log(response4);
            setLoading(false);
            setSuccessMessage("Reporte eliminado correctamente, redirigiendo...");
            setTimeout(() => {
                navigate(`/home`);
            }, 2000);
        }
        catch(error){
            setErrorMessage(`Error al eliminar el reporte`);
        }
        finally{
            setLoading(false);
        }
    }

    const handleEdit = () => {
        if(type == 'avistamiento'){
            navigate(`/sighting_edit/${idreport}/${idresponse}`);
        }
        else {
            navigate(`/found_edit/${idreport}/${idresponse}`);
        }
    }

    return (
        <div className={styles.response_box}>   
            <div className={styles.response_header}>
                <img src={userphoto ? `http://localhost:5000${userphoto}` : '/images/sin_foto_perfil.png'} className={styles.response_profile_photo}></img>
                <div className={styles._response_user_text_container}>
                    <div className={styles.response_principal_text}>
                        <p className={styles.response_nombre}>
                            {nombre}
                        </p>
                        <img src='/icons/star.svg' className={styles.response_reputation_icon} />
                        <p className={styles.response_nombre}>
                            {reputation}
                        </p>
                    </div>
                    <p className={styles.response_username}>
                        @{user}
                    </p>
                </div>
                <span className={styles.response_type_label}>{type == "avistamiento" ? "Avistamiento" : "Encontrado"}</span>
                {idviewer === report.user_id && (
                    <>
                        <img src='/icons/pencil.svg' className={styles.response_change_icon} onClick={handleEdit}/>
                        <img src='/icons/trash.svg' className={styles.response_change_icon} onClick={handleDelete}/>
                    </>
                )}
            </div>
            <div className={styles.datetime_container_response}>
                <p className={styles.datetime_text_response}>Fecha: {date}</p>
                <p className={styles.datetime_text_response}>Hora: {time}</p>
            </div>
            <p className={styles.response_description_text}>
                {comment}
            </p>
            <div className={styles.response_location_photo}>
                <div className={styles.map_response_container}>
                    {location?.coordinates && (
                        <MapaLectura ubicacion={[location.coordinates[1], location.coordinates[0]]} dragging={true} />
                    )}
                </div>
                <div className={styles.response_photo_container}>
                    <img src={petphoto} className={styles.response_photo} />    
                </div>
            </div>
            {idviewer == report.user_id && (
                <div className={styles.response_footer}>
                    <p className={styles.reputation_text}>¿Fue útil esta respuesta?</p>
                    {!like_clicked && (
                            <img src='/icons/grey_like.svg' alt='Like' 
                            className={styles.response_calification_icon} onClick={handle_like_click}/>
                        )
                    }
                    {like_clicked && (
                            <img src='/icons/green_like.svg' alt='Like' 
                            className={styles.response_calification_icon} onClick={handle_like_click}/>
                        )
                    }
                    {!dislike_clicked && (
                            <img src='/icons/grey_dislike.svg' alt='Dislike' 
                            className={styles.response_calification_icon} onClick={handle_dislike_click}/>
                        )
                    }
                    {dislike_clicked && (
                            <img src='/icons/red_dislike.svg' alt='Dislike' 
                            className={styles.response_calification_icon} onClick={handle_dislike_click}/>
                        )
                    }
                </div>
            )}
        </div>
    )
}

export default ResponseDetails;