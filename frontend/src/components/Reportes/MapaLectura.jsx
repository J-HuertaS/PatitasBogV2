import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import '../../styles/VisualizarReportes.css';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const MapaLectura = ({ ubicacion, dragging }) => {
  return (
    <MapContainer
        center={ubicacion || [4.711, -74.0721]}
        zoom={13}
        scrollWheelZoom={true}     // ✅ sí se puede hacer zoom con el scroll
        dragging={dragging}           // 🚫 no se puede mover el mapa
        doubleClickZoom={false}    // 🚫 no se puede hacer zoom con doble click
        zoomControl={true}         // ✅ muestra los botones de zoom +
        className="mapa"
>   

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {ubicacion && <Marker position={ubicacion} />}
    </MapContainer>
  );
};

export default MapaLectura;
