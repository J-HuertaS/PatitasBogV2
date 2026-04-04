import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { userService } from '../../services/userService';
import styles from '../../styles/DetailsReport.module.css';
import MapaLectura from './MapaLectura';

const ReportDetails = ( { idviewer, report } ) => {
    const { idReporte } = useParams();
    const navigate = useNavigate();
    const [petname, setPetName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [petphoto, setPetPhoto] = useState('/images/sin_foto_mascota');
    const [location, setLocation] = useState(null);
    const [description, setDescription] = useState('');
    const [user, setUser] = useState('');
    const [name, setName] = useState('');
    const [userphoto, setUserPhoto] = useState('/images/sin_foto_perfil');
    const [reputation, setReputation] = useState('');   
    const [status, setStatus] = useState('open');
    const [idreportuser, setIdReportUser] = useState('');
    const [idvieweruser, setIdViewerUser] = useState('');
    const [loading, setLoading] = useState(true);
    const [errormessage, setErrorMessage] = useState('');
    const [successmessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setIdViewerUser(idviewer);
        const fetchReporte = async () => {
            const fechaHora = report.created_at;
            const [fecha, horaCompleta] = fechaHora.split("T");
            const hora = horaCompleta.slice(0, 5);

            setPetName(report.pet_name);
            setDate(fecha);
            setTime(hora);
            setPetPhoto(report.images[0]);
            setLocation(report.location);
            setDescription(report.description);

            if(report.status == 'open'){
                setStatus('Perdido');
            }
            else{
                setStatus('Encontrado');
            }

            try{
                const response2 = await userService.getUserById(report.user_id);

                setUser(response2.user.username);
                setName(response2.user.full_name);
                setReputation(response2.user.reputation);
                setUserPhoto(response2.user.profile_picture);
                setIdReportUser(response2.user.id);
                console.log("Datos de reporte obtenidos con éxito");
            }
            catch(error){
                setErrorMessage(`Error obteniendo datos del usuario creador del reporte: ${error.message}`);
            }
            finally{
                setLoading(false);
            }
        };
     
        fetchReporte();
    }, []);

    const handleDelete = async () => {
        setLoading(true);
        try{
            const response4 = await reportService.deleteReport(idReporte);
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
        navigate(`/updating/${idReporte}`);
    }

    const handleClose = async () => {
        setLoading(true);
        try{
            const response5 = await reportService.markAsClosed(idReporte);
            setLoading(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            setSuccessMessage("Reporte cerrado correctamente, recargando...");
        }
        catch(error){
            setErrorMessage(error);
        } 
        finally{
            setLoading(false);
        }
    }

    return (
        <div className={styles.report_column}>   
            {loading && (
                <p className={styles.loadingmessage}>Cargando...</p>
            )}

            {!loading && errormessage === '' && (
                <p className={styles.successmessage}>{successmessage}</p>
            )}

            {!loading && errormessage !== '' && (
                <p className={styles.errormessage}>{errormessage}</p>
            )}
            <div className={styles.principal_data}>
                <div className={styles.columna_izquierda}>
                    <div className={styles.titulos_reporte}>
                        <p className={styles.titulo_nombre}>{petname}</p>
                        <span className={status == "Perdido" ? styles.etiqueta_perdido : styles.etiqueta_encontrado}>
                            {status}
                        </span>
                    </div>
                    <div className={styles.user_data}>
                        <div className={styles.profile_photo_container}>
                            <img
                                src={userphoto ? `http://localhost:5000${userphoto}` : '/images/sin_foto_perfil.png'}
                                alt="Foto de perfil"
                                className={styles.profile_photo}
                            />
                        </div>
                        
                        <div className={styles.user_text_container}>
                            <div className={styles.principal_text}>
                                <p className={styles.nombre}>
                                    {name}
                                </p>
                                <img src='/icons/star.svg' className={styles.reputation_icon} />
                                <p className={styles.nombre}>
                                    {reputation}
                                </p>
                            </div>
                            <p className={styles.username}>
                                @{user}
                            </p>
                        </div>
                    </div>
                    <div className={styles.created_at}>
                        <p className={styles.date_time_text}>
                            Fecha: {date}
                        </p>
                        <p className={styles.date_time_text}>
                            Hora: {time}
                        </p>
                    </div>
                    <div className={styles.photo_containter}>
                        <img src={petphoto} className={styles.photo} />
                    </div>
                </div>
                <div className={styles.columna_derecha}>
                    {idreportuser == idvieweruser && (
                        <div className={styles.modificaciones_reporte}>
                            <p className={styles.subtext}>
                                Puedes editar, eliminar o cerrar el 
                                reporte si ya tienes a tu mascota
                            </p>
                        
                            <img src='/icons/check.svg' className={styles.change_icon} onClick={handleClose}/>
                            <img src='/icons/pencil.svg' className={styles.change_icon} onClick={handleEdit}/>
                            <img src='/icons/trash.svg' className={styles.change_icon} onClick={handleDelete}/>
                        </div>
                        )
                    }
                    
                    <div className={styles.generar_respuestas}>
                        <p className={styles.subtext}>
                            Si viste o encontraste esta mascota puedes 
                            reportarlo aquí
                        </p>
                        <div className={styles.buttons_container}>
                            <Link to={`/sighting/${idReporte}`} className={styles.seen_button}>Avistamiento</Link>
                            <Link to={`/found/${idReporte}`} className={styles.found_button}>Encontrado</Link>
                        </div>
                    </div>
                    {location && location.coordinates && (
                        <div className={styles.map_containter}>
                            <MapaLectura  ubicacion={[
                                location.coordinates[1], 
                                location.coordinates[0], 
                            ]} dragging={true} />
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.description_reporte}>
                <p className={styles.description_text}>
                    {description}
                </p>
            </div>
            
        </div>
    )
}

export default ReportDetails;