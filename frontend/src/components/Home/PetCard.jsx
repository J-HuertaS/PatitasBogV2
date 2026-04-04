"use client"
import { getPetName, getStatus, getValidImage, getDefaultImage } from "../../utils/reportUtils"
import styles from "../../styles/HomeLoggedIn.module.css"

const PetCard = ({ reporte }) => {
  const petName = reporte.pet_name || "Mascota";
  const status = "Perdido"; // luego lo conectas al backend
  const imageUrl = reporte.thumbnail;

  const handleImageError = (e) => {
    e.target.src = getDefaultImage(reporte.pet_type);
  };

  return (
    <div className={styles.petCard}>
      <div className={styles.petImageContainer}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={petName}
          className={styles.petImage}
          onError={handleImageError}
        />

        <div
          className={`${styles.statusBadge} ${
            status === "Perdido" ? styles.statusPerdido : styles.statusEncontrado
          }`}
        >
          {status}
        </div>
      </div>

      <div className={styles.petCardContent}>
        <h3 className={styles.petName}>{petName}</h3>

        <div
          className={`${styles.petStatusText} ${
            status === "Perdido" ? styles.perdido : styles.encontrado
          }`}
        >
          {status === "Perdido" ? "Se busca" : "Encontrado"}
        </div>

        <p className={styles.petDescription}>
          {reporte.description || `${petName} reportado como perdido.`}
        </p>
      </div>
    </div>
  );
};

export default PetCard;