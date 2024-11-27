import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MapComponent = ({ markers, onGeolocate, userLocation }) => {
    const [map, setMap] = useState(null); 

    useEffect(() => {
        const mapInstance = L.map('map').setView([3.90039, -76.29781], 13); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(mapInstance);

        const pinkIcon = L.icon({
            iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });

        markers.forEach(marker => {
            L.marker(marker.position, { icon: pinkIcon })
                .addTo(mapInstance)
                .bindPopup(marker.title);
        });

        setMap(mapInstance);

        return () => {
            mapInstance.remove();
        };
    }, [markers]);

    useEffect(() => {
        if (userLocation && map) {
            const manIcon = L.icon({
                iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/man.png',
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

const LocationFilters = ({ handleGeolocate }) => {
    return (
        <div style={{ width: '20%', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Filtros de ubicación</h3>
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
                Geolocalizarme
            </button>
            <button
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(90deg, rgba(127, 27, 221, 1) 0%, rgba(255, 105, 180, 1) 100%)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Domicilio
            </button>
            <h3 style={{ margin: '1rem 0' }}>Servicios</h3>
            <select style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}>
                <option>Manicura</option>
                <option>Pedicura</option>
                <option>Uñas acrílicas</option>
            </select>
            <button
                style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(90deg, rgba(127, 27, 221, 1) 0%, rgba(255, 105, 180, 1) 100%)',
                    color: 'white',
                    border: 'none',
                    marginTop: '1rem',
                    cursor: 'pointer',
                }}
            >
                Filtrar
            </button>
        </div>
    );
};

const MapPage = () => {
    const userType = useSelector((state) => state.user.userType);
    const [userLocation, setUserLocation] = useState(null); 

    const [markers] = useState([
        { position: [3.9014, -76.2976], title: 'Profesional 1' },
        { position: [3.9052, -76.3108], title: 'Profesional 2' },
        { position: [3.9121, -76.3200], title: 'Profesional 3' },
    ]);

    const handleGeolocate = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                },
                (error) => {
                    alert('No se pudo obtener tu ubicación. Error: ' + error.message);
                }
            );
        } else {
            alert('La geolocalización no está soportada por tu navegador.');
        }
    };

    const inicioRoute = userType === 'cliente' ? '/inicio' : '/inicioPro';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f3f4f6' }}>
            <header style={{ backgroundColor: '#ec4899', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <Link to={inicioRoute}>
                    <img
                        src="https://i.imgur.com/QJTUutm.png"
                        alt="Logo Nails Express"
                        style={{ height: '50px', width: '200px' }}
                    />
                </Link>
                <div style={{ display: 'flex' }}>
                    <input type="text" placeholder="Buscar" style={{ padding: '0.5rem', borderRadius: '4px 0 0 4px', border: '1px solid #ccc' }} />
                    <button style={{ padding: '0.5rem', borderRadius: '0 4px 4px 0', backgroundColor: 'white', color: '#7e22ce', border: '1px solid #7e22ce' }}>
                        Buscar
                    </button>
                </div>
                <div>Nombre usuario | Tipo de usuario</div>
            </header>

            <div style={{ display: 'flex', flex: 1, padding: '2rem', gap: '1rem' }}>
                <LocationFilters handleGeolocate={handleGeolocate}/>

                <div style={{ flex: 1 }}>
                    <MapComponent markers={markers} onGeolocate={true} userLocation={userLocation}/>
                </div>
            </div>
        </div>
    );
};

export default MapPage;
