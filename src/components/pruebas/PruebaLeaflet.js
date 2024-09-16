import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Importa la librería Leaflet para crear iconos personalizados

// Cargar íconos personalizados
const userIcon = new L.Icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png', 
  iconSize: [35, 35], 
  iconAnchor: [17, 35], 
  popupAnchor: [0, -35], 
});

const additionalIcon = new L.Icon({
  iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const PruebaLeaflet = () => {
  const [position, setPosition] = useState(null);
  const [addressPosition, setAddressPosition] = useState(null); // Estado para el marcador basado en la dirección

  // Coordenadas adicionales
  const additionalPosition = [3.9010542684149674, -76.29182929215054];

  // Función que utiliza la API de geolocalización del navegador
  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Geocodificación para convertir la dirección en coordenadas
  const handleGeocode = async (event) => {
    event.preventDefault();
    const form = event.target;
    const country = form.country.value;
    const state = form.state.value;
    const city = form.city.value;
    const street = form.street.value;

    // Construye la URL para la API de Nominatim (OpenStreetMap)
    const query = `${street}, ${city}, ${state}, ${country}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setAddressPosition([parseFloat(lat), parseFloat(lon)]);
        console.log(`Geocoded Latitude: ${lat}, Longitude: ${lon}`);
      } else {
        alert('No se encontraron coordenadas para la dirección proporcionada.');
      }
    } catch (error) {
      console.error('Error en la geocodificación:', error);
    }
  };

  const LocationMarker = () => {
    const map = useMap();

    if (position) {
      map.flyTo(position, map.getZoom());
    }

    return position === null ? null : (
      <Marker position={position} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  return (
    <div>
      <form onSubmit={handleGeocode} style={{ marginBottom: '10px' }}>
        <input type="text" name="country" placeholder="País" required />
        <input type="text" name="state" placeholder="Departamento/Estado" required />
        <input type="text" name="city" placeholder="Ciudad/Municipio" required />
        <input type="text" name="street" placeholder="Dirección" required />
        <button type="submit">Buscar dirección</button>
      </form>

      <button onClick={handleGeolocate}>Geolocalizarme</button>
      
      <MapContainer
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcador para la ubicación adicional */}
        <Marker position={additionalPosition} icon={additionalIcon}>
          <Popup>Punto adicional</Popup>
        </Marker>

        {/* Marcador para la geolocalización */}
        <LocationMarker />

        {/* Marcador para la dirección ingresada */}
        {addressPosition && (
          <Marker position={addressPosition} icon={additionalIcon}>
            <Popup>Ubicación de la dirección ingresada</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default PruebaLeaflet;




