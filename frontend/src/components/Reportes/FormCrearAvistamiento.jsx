import React, { useState, useEffect } from 'react';
import '../../styles/FormsReportes.css';
import MapaSelector from './MapaSelector';
import { responseService } from '../../services/responseService';

const FormCrearAvistamiento = ({ onChangeSuccess, onChangeFail }) => {
    const tiporeporteInput = 'avistamiento';
    const [detallesInput, setDetallesInput] = useState('');
    const [ubicacionInput, setUbicacionInput] = useState(null);
    const [imagenInput, setImagenInput] = useState(null);
    const [reportId, setReportId] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        setImagenInput(file);
        } else {
        alert("Por favor selecciona una imagen JPG o PNG.");
        e.target.value = null;
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        setReportId(id);
    }, []);

    const validateForm = () => {
        let currentErrors = [];
        let isValid = true;

        if (detallesInput === '') {
            currentErrors.push('El campo de detalles no puede estar vacío.');
            isValid = false;
        }
        if (ubicacionInput == null) {
            currentErrors.push('El campo de ubicación no puede estar vacío.');
            isValid = false;
        }
        return { isValid, errors: currentErrors.join('\n') };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { isValid, errors } = validateForm();

        if (!reportId) {
            onChangeFail('Error crítico', 'No se encontró el ID del reporte.');
            return;
        }

        if (isValid) {
            const responseData = {
                type: tiporeporteInput,
                comment: detallesInput,
                location: {
                    type: 'Point',
                    coordinates: [ubicacionInput.lng, ubicacionInput.lat], 
                },
                images: ["/images/foto_mascota.png"]
            };

            try {
                await responseService.createResponse(reportId, responseData);
                onChangeSuccess(
                    '¡Reporte de avistamiento creado correctamente!',
                    'inicio',
                    `/report_details?id=${reportId}`
                );
            } catch (error) {
                console.error(error);
                onChangeFail(
                    '¡Error al crear reporte!',
                    'No se pudo crear el reporte. Intenta nuevamente.'
                );
            }
        } else {
            onChangeFail('Error en el formulario', errors);
        }
    };

    return (
        <div className='container-modulo-reportes'>
            <div className='cabecera-container-reportes'>
                <span className='spacer'></span>
                <span className='title'><h2>Crear Reporte</h2></span>
                <a href='/home'><span className='close'>X</span></a>
            </div>
            <form onSubmit={handleSubmit} className='formulario-modulo-reportes'>
                <div className='filas-container-reportes'>
                    <label>Tipo de Reporte</label>
                    <span className='blocked-input'>Avistamiento</span>
                    <p className='behind-input'></p>
                </div>
                <label>Detalles*</label>
                <textarea
                    className='textarea-reportes'
                    value={detallesInput}
                    onChange={(e) => setDetallesInput(e.target.value)}
                    rows="5"
                />
                <p className='behind-input'></p>
                <div className='columnas-container-reportes'>
                    <div className='filas-container-reportes'>
                        <label>Ubicación*</label>
                        <MapaSelector setUbicacion={setUbicacionInput} ubicacionInicial={ubicacionInput} />
                        <p className='behind-input'></p>
                    </div>
                    <div className='filas-container-reportes'>
                        <label className="label-foto">Foto (JPG o PNG)*</label>
                        <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="input-foto"
                        />
                        {imagenInput && (
                        <img
                            src={URL.createObjectURL(imagenInput)}
                            alt="Preview"
                            className="preview-foto"
                        />
                        )}
                    </div>
                </div>
                <div className='buttons-div-reportes'>
                    <a href='/home' className='button-secondary'>Descartar</a>
                    <button type="submit" className="button-principal">Crear</button>
                </div>
            </form>
            <h3>Los campos señalados con * no pueden quedar vacíos</h3>
        </div>
    );
};

export default FormCrearAvistamiento;
