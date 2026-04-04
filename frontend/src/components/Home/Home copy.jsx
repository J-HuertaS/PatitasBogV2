"use client"

import { useState, useEffect, useRef } from "react"
import "../../styles/Home.css"
import { reportService } from "../../services/reportService"

const Home = () => {
  const [reportes, setReportes] = useState([])
  const [filteredReportes, setFilteredReportes] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)

  // Estados para filtros
  const [radiusFilter, setRadiusFilter] = useState("all") // "all", "1", "5", "10", "25"
  const [typeFilter, setTypeFilter] = useState("all") // "all", "perro", "gato", "otro"
  const [userLocation, setUserLocation] = useState(null)

  // Número de tarjetas visibles según el tamaño de pantalla
  const [cardsPerView, setCardsPerView] = useState(4)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await reportService.getAllReports()
        console.log("Reportes recibidos:", response)
        const reportesArray = Array.isArray(response) ? response : []
        setReportes(reportesArray)
        setFilteredReportes(reportesArray)
      } catch (error) {
        console.error("Error al obtener reportes:", error)
        setReportes([])
        setFilteredReportes([])
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Error obteniendo ubicación:", error)
          // Ubicación por defecto (Bogotá)
          setUserLocation({ lat: 4.6097, lng: -74.0817 })
        },
      )
    } else {
      // Ubicación por defecto (Bogotá)
      setUserLocation({ lat: 4.6097, lng: -74.0817 })
    }
  }, [])

  // Función para calcular distancia entre dos puntos (en km)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLng = (lng2 - lng1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...reportes]

    // Filtro por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter((reporte) => reporte.type?.toLowerCase() === typeFilter.toLowerCase())
    }

    // Filtro por radio de ubicación
    if (radiusFilter !== "all" && userLocation) {
      const maxDistance = Number.parseInt(radiusFilter)
      filtered = filtered.filter((reporte) => {
        if (!reporte.location?.coordinates) return false
        const [lng, lat] = reporte.location.coordinates
        const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng)
        return distance <= maxDistance
      })
    }

    setFilteredReportes(filtered)
    setCurrentIndex(0) // Resetear índice al aplicar filtros
  }, [reportes, typeFilter, radiusFilter, userLocation])

  // Actualizar número de tarjetas visibles según el tamaño de pantalla
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth
      const cardWidth = 300 + 32
      const availableWidth = width - 200

      const maxCards = Math.floor(availableWidth / cardWidth)

      if (width < 480) {
        setCardsPerView(Math.min(1, maxCards))
      } else if (width < 768) {
        setCardsPerView(Math.min(2, maxCards))
      } else if (width < 1200) {
        setCardsPerView(Math.min(3, maxCards))
      } else {
        setCardsPerView(Math.min(4, maxCards))
      }
    }

    updateCardsPerView()
    window.addEventListener("resize", updateCardsPerView)
    return () => window.removeEventListener("resize", updateCardsPerView)
  }, [])

  // Función para determinar el estado de la mascota
  const getStatus = (reporte) => {
    if (reporte.status === "open") return "Perdido"
    if (reporte.status === "found") return "Encontrado"
    if (reporte.status === "closed") return "Encontrado"
    return "Perdido"
  }

  // Función para obtener el nombre de la mascota
  const getPetName = (reporte) => {
    const type = reporte.type || "Mascota"
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  // Función para obtener imagen válida o imagen por defecto
  const getValidImage = (reporte) => {
    const images = reporte.images || []

    if (images.length === 0) {
      return getDefaultImage(reporte.type)
    }

    const firstImage = images[0]

    if (
      firstImage === "string" ||
      firstImage === "como se pasan imagenes? xd" ||
      !firstImage ||
      firstImage.trim() === ""
    ) {
      return getDefaultImage(reporte.type)
    }

    if (firstImage.startsWith("http://") || firstImage.startsWith("https://")) {
      return firstImage
    }

    if (firstImage.startsWith("/")) {
      return `${window.location.origin}${firstImage}`
    }

    return `${window.location.origin}/uploads/${firstImage}`
  }

  // Función para obtener imagen por defecto según el tipo de mascota
  const getDefaultImage = (type) => {
    switch (type?.toLowerCase()) {
      case "perro":
        return "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face"
      case "gato":
        return "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop&crop=face"
      case "otro":
        return "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop&crop=center"
      default:
        return "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center"
    }
  }

  // Función para manejar errores de carga de imagen
  const handleImageError = (e, type) => {
    e.target.src = getDefaultImage(type)
  }

  // Función para navegar hacia la izquierda
  const scrollLeft = () => {
    if (currentIndex > 0) {
      const newIndex = Math.max(0, currentIndex - cardsPerView)
      setCurrentIndex(newIndex)
      scrollToIndex(newIndex)
    }
  }

  // Función para navegar hacia la derecha
  const scrollRight = () => {
    const maxIndex = Math.max(0, filteredReportes.length - cardsPerView)
    if (currentIndex < maxIndex) {
      const newIndex = Math.min(maxIndex, currentIndex + cardsPerView)
      setCurrentIndex(newIndex)
      scrollToIndex(newIndex)
    }
  }

  // Función para hacer scroll suave a un índice específico
  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const cardWidth = 300 + 32
      const scrollPosition = index * cardWidth
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  // Función para ir a un punto específico del carrusel
  const goToSlide = (index) => {
    setCurrentIndex(index)
    scrollToIndex(index)
  }

  // Calcular número total de "páginas" del carrusel
  const totalPages = Math.ceil(filteredReportes.length / cardsPerView)

  return (
    <div className="home-container">
      <div className="reports-scroll-container">
        {loading ? (
          <div className="loading-container">Cargando reportes...</div>
        ) : (
          <div className="carousel-container">
            {/* Navigation Controls with Filters */}
            <div className="carousel-controls">
              {/* Navegación izquierda */}
              <button
                className="carousel-nav"
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                aria-label="Ver reportes anteriores"
              >
                ‹
              </button>

              {/* Filters */}
              <div className="filters-container">
                <div className="filter-group">
                  <label className="filter-label">Radio</label>
                  <select
                    className="filter-select"
                    value={radiusFilter}
                    onChange={(e) => setRadiusFilter(e.target.value)}
                  >
                    <option value="all">Toda la ciudad</option>
                    <option value="1">1 km</option>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="25">25 km</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Tipo</label>
                  <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="all">Todas las mascotas</option>
                    <option value="perro">Perros</option>
                    <option value="gato">Gatos</option>
                    <option value="otro">Otros</option>
                  </select>
                </div>

                <div className="results-counter">
                  {filteredReportes.length} resultado{filteredReportes.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Navegación derecha */}
              <button
                className="carousel-nav"
                onClick={scrollRight}
                disabled={currentIndex >= Math.max(0, filteredReportes.length - cardsPerView)}
                aria-label="Ver más reportes"
              >
                ›
              </button>
            </div>

            {/* Cards Carousel */}
            {filteredReportes.length === 0 ? (
              <div className="no-results-container">
                <h3>No se encontraron reportes</h3>
                <p>Intenta ajustar los filtros para ver más resultados</p>
              </div>
            ) : (
              <div className="cards-carousel" ref={carouselRef}>
                {filteredReportes.map((reporte, index) => {
                  const status = getStatus(reporte)
                  const petName = getPetName(reporte)
                  const imageUrl = getValidImage(reporte)

                  return (
                    <div className="pet-card" key={reporte._id || index}>
                      {/* Pet Image */}
                      <div className="pet-image-container">
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt={petName}
                          className="pet-image"
                          onError={(e) => handleImageError(e, reporte.type)}
                        />

                        {/* Status Badge */}
                        <div
                          className={`status-badge ${status === "Perdido" ? "status-perdido" : "status-encontrado"}`}
                        >
                          {status}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="pet-card-content">
                        {/* Pet Name */}
                        <h3 className="pet-name">{petName}</h3>

                        {/* Status Text - Subtle label */}
                        <div className={`pet-status-text ${status.toLowerCase()}`}>
                          {status === "Perdido" ? "Se busca" : "Encontrado"}
                        </div>

                        {/* Description */}
                        <p className="pet-description">
                          {reporte.description && reporte.description !== "string"
                            ? reporte.description
                            : `${petName} reportado como perdido. Se busca información sobre su paradero.`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Notice - Always visible */}
      <div className="bottom-notice">
        <p>Para ver más detalles e interactuar con los reportes debes iniciar sesión</p>
      </div>
    </div>
  )
}

export default Home
