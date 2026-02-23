import React, { useState, useEffect } from 'react';
import '../../styles/FormsReportes.css';
import MapaSelector from './MapaSelector';
import { reportService } from '../../services/reportService';

const FormEditarPerdida = ({ onChangeSuccess, onChangeFail }) => {
    const tiporeporteInput = 'Perdida';
    const [tipomascotaInput, setTipoMascotaInput] = useState('');
    const [detallesInput, setDetallesInput] = useState('');
    const [ubicacionInput, setUbicacionInput] = useState(null);
    const [imagenInput, setImagenInput] = useState(null);
    const [reportId, setReportId] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        setReportId(id);

        const fetchData = async () => {
            try {
                const report = await reportService.getReportById(id);

                setTipoMascotaInput(report.type || '');
                setDetallesInput(report.description || '');
                setUbicacionInput({
                    lat: report.location.coordinates[1],
                    lng: report.location.coordinates[0],
                });
                setImagenInput(report.images[0] || null);
            } catch (error) {
                console.error('Error al obtener el reporte:', error);
                onChangeFail('Error al cargar', 'No se pudo cargar la información del reporte.');
            }
        };

        if (id) fetchData();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            setImagenInput(file);
        } else {
            alert("Por favor selecciona una imagen JPG o PNG.");
            e.target.value = null;
        }
    };

    const validateForm = () => {
        let currentErrors = [];
        let isValid = true;

        if (tipomascotaInput === '') {
            currentErrors.push('El campo de tipo de mascota no puede estar vacío.');
            isValid = false;
        }
        if (detallesInput === '') {
            currentErrors.push('El campo de detalles no puede estar vacío.');
            isValid = false;
        }
        if (ubicacionInput == null) {
            currentErrors.push('El campo de ubicación no puede estar vacío.');
            isValid = false;
        }
        if (imagenInput == null) {
            currentErrors.push('El campo de foto no puede estar vacío.');
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
            const updatedReport = {
                type: tipomascotaInput,
                description: detallesInput,
                location: {
                    type: 'Point',
                    coordinates: [ubicacionInput.lng, ubicacionInput.lat],
                },
                images: ["/images/foto_mascota.png"],
            };

            try {
                await reportService.updateReport(reportId, updatedReport);
                onChangeSuccess(
                    '¡Reporte actualizado correctamente!',
                    'detalles de reporte',
                    `/report_details?id=${reportId}`
                );
            } catch (error) {
                console.error('Error al actualizar el reporte:', error);
                onChangeFail(
                    '¡Error al actualizar reporte!',
                    'No se pudo actualizar el reporte. Intenta nuevamente.'
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
                <span className='title'><h2>Editar Reporte</h2></span>
                <a href='/home'><span className='close'>X</span></a>
            </div>
            <form onSubmit={handleSubmit} className='formulario-modulo-reportes'>
                <div className='columnas-container-reportes'>
                    <div className='filas-container-reportes'>
                        <label>Tipo de Reporte</label>
                        <span className='blocked-input'>{tiporeporteInput}</span>
                        <p className='behind-input'></p>
                    </div>
                    <div className='filas-formulario'>
                        <label>Tipo de Mascota*</label>
                        <select
                            value={tipomascotaInput}
                            onChange={(e) => setTipoMascotaInput(e.target.value)}
                        >
                            <option value="">Seleccione una opción</option>
                            <option value="perro">perro</option>
                            <option value="gato">gato</option>
                            <option value="otro">otro</option>
                        </select>
                        <p className='behind-input'></p>
                    </div>
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
                                src={
                                    typeof imagenInput === 'string'
                                        ? imagenInput
                                        : URL.createObjectURL(imagenInput)
                                }
                                alt="Preview"
                                className="preview-foto"
                            />
                        )}
                    </div>
                </div>
                <div className='buttons-div-reportes'>
                    <a href='/home' className='button-secondary'>Descartar</a>
                    <button type="submit" className="button-principal">Guardar</button>
                </div>
            </form>
            <h3>Los campos señalados con * no pueden quedar vacíos</h3>
        </div>
    );
};

export default FormEditarPerdida;
