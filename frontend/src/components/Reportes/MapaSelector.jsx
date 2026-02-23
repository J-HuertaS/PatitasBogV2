import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import '../../styles/FormsReportes.css';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const LocationMarker = ({ setUbicacion, ubicacionInicial }) => {
  const [position, setPosition] = useState(ubicacionInicial || null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setUbicacion(e.latlng);
    },
  });

  return position ? (
    <Marker position={position} />
  ) : null;
};

const MapaSelector = ({ setUbicacion, ubicacionInicial }) => {
  return (
    <MapContainer
      center={ubicacionInicial || [4.711, -74.0721]}
      zoom={13}
      scrollWheelZoom={true}
      className="mapa"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker 
        setUbicacion={setUbicacion} 
        ubicacionInicial={ubicacionInicial} 
      />
    </MapContainer>
  );
};

export default MapaSelector;
