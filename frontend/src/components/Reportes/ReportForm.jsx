"use client"

import { useState, useEffect } from "react"
import MapaSelector from "./MapaSelector"
import styles from "../../styles/ReportForm.module.css"
import { useNavigate, useParams } from "react-router-dom"
import { reportService } from "../../services/reportService"
import { responseService } from "../../services/responseService"
import { imageService } from "../../services/imageService"

const ReportForm = ({ type = "lost" }) => {
  const { reportId, responseId } = useParams()

  const isLost = type === "lost"
  const isFound = type === "found"
  const isEdit = type === "updating"
  const isSighting = type === "sighting"
  const isSightingEdit = type === "sightingEdit"
  const isFoundEdit = type === "foundEdit"

  const [isLoading, setIsLoading] = useState((isEdit || isFound || isSighting || isSightingEdit || isFoundEdit) && !!reportId)
  const [petName, setPetName] = useState("")
  const [petType, setPetType] = useState("")
  const [details, setDetails] = useState("")
  const [location, setLocation] = useState(null)
  const [newPhotos, setNewPhotos] = useState([])
  const [existingPhotoURLs, setExistingPhotoURLs] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [missingFieldsState, setMissingFieldsState] = useState([])
  const [message, setMessage] = useState({ type: "", text: "" })

  const formTitle = isEdit
    ? "Editar Reporte"
    : isLost
    ? "Crear Reporte"
    : isSighting || isFound
    ? "Responder Reporte"
    : "Editar Respuesta"

  const typeLabel = isEdit || isLost
    ? "Pérdida"
    : isSighting || isSightingEdit
    ? "Avistamiento"
    : "Encontrado"

  const navigate = useNavigate()

  useEffect(() => {
    const loadReport = async () => {
      if (!reportId || isLost) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        let report
        if (isFoundEdit || isSightingEdit) {
          const responseData = await responseService.getResponseById(reportId, responseId)
          report = responseData
          console.log(report)
          const reportData = await reportService.getReportById(reportId)
          setPetName(reportData.pet_name || "")
          setPetType(reportData.type ? reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1) : "")
          setDetails(report.comment || "")
          setLocation(
            report.location?.coordinates
              ? { lat: report.location.coordinates[1], lng: report.location.coordinates[0] }
              : null
          )
          if (report.images?.length) {
            setExistingPhotoURLs(report.images)
          }
        } else {
          const report = await reportService.getReportById(reportId)
          
          setPetName(report.pet_name || "")
          setPetType(report.type ? report.type.charAt(0).toUpperCase() + report.type.slice(1) : "")
          if(isEdit){
            setDetails(report.description || "")
            setLocation(
              report.location?.coordinates
                ? { lat: report.location.coordinates[1], lng: report.location.coordinates[0] }
                : null
            )
            if (report.images?.length) {
              setExistingPhotoURLs(report.images)
            }
          }
          
        }
      } catch (err) {
        setMessage({ type: "error", text: "Error al cargar el reporte. Inténtalo de nuevo." })
      } finally {
        setIsLoading(false)
      }
    }
    loadReport()
  }, [reportId, responseId, isEdit, isFoundEdit, isSightingEdit, isLost])

  const handleDiscard = () => {
    navigate(-1)
  }

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewPhotos(Array.from(e.target.files))
    }
  }

  const handleRemoveNewPhoto = (index) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingPhoto = (index) => {
    setExistingPhotoURLs((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })
    setMissingFieldsState([])

    const requiredFields = ["details", "location"]
    if (isLost || isEdit || isFound || isFoundEdit) {
      requiredFields.push("photos")
    }
    if (isLost || isEdit) {
      requiredFields.push("petName", "petType")
    }

    const allCurrentPhotosForValidation = [...existingPhotoURLs, ...newPhotos]
    const formDataForValidation = { petName, petType, details, location, photos: allCurrentPhotosForValidation }

    const missingFields = requiredFields.filter((field) => {
      if (field === "location") return !location
      if (field === "photos") return allCurrentPhotosForValidation.length === 0
      if ((field === "petName" && (isLost || isEdit)) || (field === "petType" && (isLost || isEdit))) {
        return !formDataForValidation[field]
      }
      return !formDataForValidation[field]
    })

    if (missingFields.length > 0) {
      setMissingFieldsState(missingFields)
      setMessage({ type: "error", text: "Por favor, completa todos los campos obligatorios." })
      setIsSubmitting(false)
      return
    }

    try {
      const uploadedImageUrls = []
      for (const file of newPhotos) {
        const formData = new FormData()
        formData.append("image", file)
        const response = await imageService.uploadImage(formData)
        if (response?.imageUrl) {
          uploadedImageUrls.push(response.imageUrl)
        } else {
          throw new Error("URL de imagen no recibida después de la carga.")
        }
      }

      const allPhotosForBackend = [...existingPhotoURLs, ...uploadedImageUrls]

      let backendPayload
      if (isLost || isEdit) {
        backendPayload = {
          pet_name: petName,
          type: petType.toLowerCase(),
          description: details,
          location: { type: "Point", coordinates: [location.lng, location.lat] },
          images: allPhotosForBackend,
        }
        if (isEdit) {
          await reportService.updateReport(reportId, backendPayload)
          setMessage({ type: "success", text: "Reporte actualizado con éxito!" })
        } else {
          await reportService.createReport(backendPayload)
          setMessage({ type: "success", text: "Reporte creado con éxito!" })
        }
      } else if (isSighting || isFound || isSightingEdit || isFoundEdit) {
        backendPayload = {
          type: "avistamiento",
          comment: details,
          location: { type: "Point", coordinates: [location.lng, location.lat] },
          images: allPhotosForBackend,
        }
        if (isSighting || isFound) {
          await responseService.createResponse(reportId, backendPayload)
          setMessage({ type: "success", text: "Respuesta enviada con éxito!" })
        } else {
          await responseService.updateResponse(reportId, responseId, backendPayload)
          setMessage({ type: "success", text: "Respuesta actualizada con éxito!" })
        }
      }

      setTimeout(() => navigate(-1), 1500)
    } catch (error) {
      console.error("Error al enviar el reporte:", error)
      setMessage({ type: "error", text: "Error al enviar el reporte. Inténtalo de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.reportFormContainer}>
        <p className={styles.loadingText}>Cargando datos del reporte...</p>
      </div>
    )
  }

  const allPhotos = [
    ...existingPhotoURLs.map((url) => ({ type: "url", value: url })),
    ...newPhotos.map((file) => ({ type: "file", value: file })),
  ]

  return (
    <div className={styles.reportFormContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>{formTitle}</h2>
        <hr className={styles.divider} />

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formFieldFull}>
            <label className={styles.formLabel}>Tipo de reporte</label>
            <input type="text" value={typeLabel} className={styles.formInput} readOnly />
          </div>

          <div className={styles.formFieldFull}>
            <label className={styles.formLabel}>Nombre mascota</label>
            <input
              type="text"
              placeholder="Escribe el nombre de tu mascota"
              className={`${styles.formInput} ${missingFieldsState.includes("petName") ? styles.inputError : ""}`}
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              readOnly={!isLost && !isEdit}
            />
          </div>

          <div className={styles.formFieldFull}>
            <label className={styles.formLabel}>Tipo de mascota</label>
            <select
              name="petType"
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              className={`${styles.formInput} ${missingFieldsState.includes("petType") ? styles.inputError : ""}`}
              disabled={!isLost && !isEdit}
            >
              <option value="">Selecciona una opción</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className={styles.formFieldFull}>
            <label className={styles.formLabel}>Detalles</label>
            <textarea
              placeholder="Escribe los detalles importantes"
              className={`${styles.formInput} ${styles.textarea} ${missingFieldsState.includes("details") ? styles.inputError : ""}`}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Ubicación</label>
            <div className={`${styles.mapContainer} ${missingFieldsState.includes("location") ? styles.inputError : ""}`}>
              <MapaSelector setUbicacion={setLocation} ubicacionInicial={location} />
            </div>
            {location && (
              <p className={styles.locationText}>
                Ubicación seleccionada: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
          </div>

          <div className={styles.formField}>
            <label className={styles.formLabel}>Fotos</label>
            <div className={`${styles.photoUploadContainer} ${missingFieldsState.includes("photos") ? styles.inputError : ""}`}>
              <div className={styles.photoPreviewGrid}>
                {allPhotos.length > 0 ? (
                  allPhotos.map((item, idx) => (
                    <div key={idx} className={styles.photoItem}>
                      <img
                        src={item.type === "url" ? item.value : URL.createObjectURL(item.value)}
                        alt={`Foto ${idx + 1}`}
                        className={styles.photoPreview}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          item.type === "url"
                            ? handleRemoveExistingPhoto(idx)
                            : handleRemoveNewPhoto(idx - existingPhotoURLs.length)
                        }
                        className={styles.removePhotoButton}
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <p>No has subido ninguna foto.</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className={styles.fileInput}
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className={styles.uploadButton}>
                Subir fotos
              </label>
            </div>
          </div>

          {message.text && (
            <div className={`${styles.messageBox} ${message.type === "error" ? styles.error : styles.success}`}>
              {message.text}
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" onClick={handleDiscard} className={styles.discardButton} disabled={isSubmitting}>
              Descartar
            </button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : isEdit ? "Actualizar" : isLost ? "Crear" : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportForm
