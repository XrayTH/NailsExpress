import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserByEmail } from './../services/userService';
import { getAllDomicilios, getDomicilioById, aceptarDomicilio, cancelarDomicilio, completarDomicilio, actualizarUbicacionProfesional } from '../services/domicileService'

const MapComponent = ({ map, setMap, markers, onGeolocate, userLocation }) => {
    const markerGroupRef = useRef(null); // Para almacenar los marcadores actuales

    useEffect(() => {
        // Inicializar el mapa
        const mapInstance = L.map('map').setView([3.90039, -76.29781], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(mapInstance);

        // Crear grupo para los marcadores
        markerGroupRef.current = L.layerGroup().addTo(mapInstance);
        setMap(mapInstance);

        return () => {
            mapInstance.remove();
        };
    }, []);

    useEffect(() => {
        if (!map || !markerGroupRef.current) return;

        const pinkIcon = L.icon({
            iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });

        // Limpiar marcadores antiguos
        markerGroupRef.current.clearLayers();

        // Agregar nuevos marcadores
        markers.forEach((marker) => {
            const { title, direccion } = marker;

            const popupContent = document.createElement('div');
            popupContent.style.fontFamily = 'Arial, sans-serif';
            popupContent.style.padding = '10px';

            const titleElement = document.createElement('h2');
            titleElement.style.marginBottom = '5px';
            titleElement.textContent = title;
            popupContent.appendChild(titleElement);

            const direccionElement = document.createElement('p');
            direccionElement.style.margin = '5px 0';
            direccionElement.style.fontSize = '14px';
            direccionElement.style.color = '#555';
            direccionElement.textContent = `Dirección: ${direccion}`;
            popupContent.appendChild(direccionElement);

            L.marker(marker.position, { icon: pinkIcon })
                .addTo(markerGroupRef.current)
                .bindPopup(popupContent);
        });
    }, [markers, map]);

    useEffect(() => {
        if (userLocation && map) {
            const manIcon = L.icon({
                iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/motorcycling.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            });

            L.marker(userLocation, { icon: manIcon })
                .addTo(map)
                .bindPopup('Estás aquí')
                .openPopup();
            map.setView(userLocation, 16);
        }
    }, [userLocation, map]);

    return <div id="map" style={{ height: '500px', width: '100%', borderRadius: '8px' }}></div>;
};

const Menu = ({ estado, handleGeolocate, domiciles, domicilio, aceptarDomicilio, cancelarDomicilio, finalizarDomicilio }) => {
    const renderContent = () => {
      switch (estado) {
        case '':
          return (
            <div>
              {domiciles
                .filter((domicile) => domicile.estado === 'Solicitado')
                .map((domicile) => (
                  <div
                    key={domicile._id.toString()}
                    style={{
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  >
                    <p><strong>Cliente:</strong> {domicile.cliente}</p>
                    <p><strong>Dirección:</strong> {domicile.direccion}</p>
                    <button
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#28A745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                      onClick={()=>{aceptarDomicilio(domicile)}}
                    >
                      Aceptar
                    </button>
                  </div>
                ))}
            </div>
          );
  
        case 'Aceptado':
          return <div>
            <p><strong>Cliente:</strong> {domicilio.cliente}</p>
            <p><strong>Direccion:</strong> {domicilio.direccion}</p>
            <p><strong>Telefono:</strong> {domicilio.telefono}</p>
            <button onClick={()=>{cancelarDomicilio("ekisde")}}>Cancelar</button>
            <button onClick={()=>{finalizarDomicilio("ekisde")}}>Completar</button>
          </div>;
  
        case 'Cancelado':
          return <div>
            <p>Cancelado. Se le ha notificado al cliente.</p>
            <button onClick={()=>{
              window.location.reload()
              }}>OK</button>
            </div>;
  
        case 'Completado':
          return <div>
          <p>Se le ha notificado al cliente que has llegado. Muchas gracias por usar NailsExpress.</p>
          <button onClick={()=>{
            window.location.reload()
            }}>OK</button>
          </div>;
  
        default:
          return <div>Error inesperado</div>;
      }
    };
  
    return (
      <div
        id="menu"
        style={{
          width: '20%',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <button
          onClick={handleGeolocate}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            background: 'linear-gradient(90deg, rgba(127, 27, 221, 1) 0%, rgba(255, 105, 180, 1) 100%)',
            color: 'white',
            border: 'none',
            marginBottom: '1rem',
            cursor: 'pointer',
          }}
        >
          Geolocalizar
        </button>
  
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '0.5rem',
          }}
        >
          {renderContent()}
        </div>
      </div>
    );
  };  

const MapPagePro = () => {
    const [map, setMap] = useState(null);
    const userType = useSelector((state) => state.user.userType);
    const email = useSelector((state) => state.user.user.email);
    const [user, setUser] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [domiciles, setDomiciles] = useState([]);
    const [domicile, setDomicile] = useState({});
    const [ estado, setEstado ] = useState('')

    useEffect(() => {
        handleGeolocate()
        const fetchUser = async () => {
            const userObj = await getUserByEmail(email);
            if (userObj) {
                setUser(userObj.usuario);
            }
        };
        fetchUser();
    }, [email]);

    useEffect(() => {
        const fetchDomiciles = async () => {
            const domiciles = await getAllDomicilios();

            const formattedMarkers = domiciles
            .filter(domicile => domicile.estado === "Solicitado")
            .map(domicile => ({
                position: [domicile.ubicacionCliente.lat, domicile.ubicacionCliente.lng],
                title: domicile.cliente,
                direccion: domicile.direccion
            }));

            setMarkers(formattedMarkers);
            setDomiciles(domiciles);
        };
        fetchDomiciles();
    }, []);

    const handleGeolocate = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    console.log([latitude, longitude])
                },
                (error) => {
                    alert('No se pudo obtener tu ubicación. Error: ' + error.message);
                }
            );
        } else {
            alert('La geolocalización no está soportada por tu navegador.');
        }
    };

    const establecerRuta = async (coordenadas) => {
      handleGeolocate()
      console.log(userLocation)
      const [userLat, userLng] = userLocation;
      const { lat: destLat, lng: destLng } = coordenadas;
  
      try {
          // Hacer una solicitud a la API OSRM para obtener la ruta
          const response = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${destLng},${destLat}?overview=full&geometries=geojson`
          );
  
          if (!response.ok) {
              throw new Error(`Error al obtener ruta: ${response.statusText}`);
          }
  
          const data = await response.json();
  
          // Obtener las coordenadas de la ruta
          const routeCoordinates = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  
          // Dibujar la ruta en el mapa
          const routeLayer = L.polyline(routeCoordinates, {
              color: 'blue',
              weight: 4,
              opacity: 0.7,
          }).addTo(map);
  
          // Enfocar la vista en la ruta
          map.fitBounds(routeLayer.getBounds());
  
          // Eliminar cualquier ruta previa
          if (map._currentRoute) {
              map.removeLayer(map._currentRoute);
          }
  
          // Almacenar la ruta actual en el mapa
          map._currentRoute = routeLayer;
  
      } catch (error) {
          console.error('Error al establecer la ruta:', error);
          alert('No se pudo trazar la ruta. Por favor, inténtalo nuevamente.');
      }
  };  

    const verificarDomicilio = (id) => {}

    const aceptarDomicilio = (id) => {
        handleGeolocate()
        setDomicile(id)
        setEstado("Aceptado")
        establecerRuta(id.ubicacionCliente)
    }

    const cancelarDomicilio = (id) => {
        setEstado("Cancelado")
    }
    
    const finalizarDomicilio = (id) => {
        setEstado("Completado")
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f3f4f6' }}>
            <header style={{ backgroundColor: '#ec4899', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <Link to={'/'}>
                    <img
                        src="https://i.imgur.com/QJTUutm.png"
                        alt="Logo Nails Express"
                        style={{ height: '50px', width: '200px' }}
                    />
                </Link>
                <div>{user} | {userType}</div>
            </header>

            <div style={{ display: 'flex', flex: 1, padding: '2rem', gap: '1rem' }}>
                <Menu 
                    estado={estado} 
                    handleGeolocate={handleGeolocate} 
                    domiciles={domiciles} 
                    domicilio={domicile}
                    aceptarDomicilio={aceptarDomicilio} 
                    cancelarDomicilio={cancelarDomicilio} 
                    finalizarDomicilio={finalizarDomicilio}
                />
                <div style={{ flex: 1 }}>
                    <MapComponent map={map} setMap={setMap} markers={markers} onGeolocate={true} userLocation={userLocation} ruta={establecerRuta}/>
                </div>
            </div>
        </div>
    );
};

export default MapPagePro;
