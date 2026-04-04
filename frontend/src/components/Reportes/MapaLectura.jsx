import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "../../styles/Map.module.css"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

const MapaLectura = ({ ubicacion, dragging }) => {
  return (
    <MapContainer
      center={ubicacion || [4.711, -74.0721]}
      zoom={13}
      scrollWheelZoom={true}
      dragging={dragging}
      doubleClickZoom={false}
      zoomControl={true}
      className="mapa"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {ubicacion && <Marker position={ubicacion} />}
    </MapContainer>
  )
}

export default MapaLectura
