const getPetName = (reporte) => {
  const petType = reporte.pet_type || reporte.type || reporte.animal_type || "Mascota"
  const petName = reporte.pet_name || reporte.name || reporte.petName || null
  if (petName && petName !== "string" && petName.trim() !== "") {
    return petName.charAt(0).toUpperCase() + petName.slice(1)
  }
  return petType.charAt(0).toUpperCase() + petType.slice(1)
}

const getStatus = (reporte) => {
  if (reporte.status === "open") return "Perdido"
  if (reporte.status === "found") return "Encontrado"
  if (reporte.status === "closed") return "Encontrado"
  return "Perdido"
}

const getValidImage = (reporte) => {
  const images = reporte.images || []
  if (images.length === 0) return getDefaultImage(reporte.type)
  const firstImage = images[0]
  if (!firstImage || firstImage === "string" || firstImage.trim() === "") {
    return getDefaultImage(reporte.type)
  }
  if (firstImage.startsWith("http://") || firstImage.startsWith("https://")) return firstImage
  if (firstImage.startsWith("/")) return `${window.location.origin}${firstImage}`
  return `${window.location.origin}/uploads/${firstImage}`
}

const getDefaultImage = (type) => {
  switch (type?.toLowerCase()) {
    case "perro":
      return "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&crop=face"
    case "gato":
      return "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&crop=face"
    default:
      return "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=center"
  }
}

export {
  getPetName,
  getStatus,
  getValidImage,
  getDefaultImage
}
