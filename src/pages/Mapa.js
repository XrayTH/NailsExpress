import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllProfiles } from './../services/profileService';
import { getUserByEmail } from './../services/userService';

const MapComponent = ({ markers, onGeolocate, userLocation, navigateToProfile }) => {
    const [map, setMap] = useState(null);
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
            iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        });

        // Limpiar marcadores antiguos
        markerGroupRef.current.clearLayers();

        // Agregar nuevos marcadores
        markers.forEach((marker) => {
            const { title, direccion, descripcion, servicios, email } = marker;

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

            const descripcionElement = document.createElement('p');
            descripcionElement.style.margin = '5px 0';
            descripcionElement.style.fontSize = '14px';
            descripcionElement.style.color = '#555';
            descripcionElement.textContent = `Descripción: ${descripcion}`;
            popupContent.appendChild(descripcionElement);

            const serviciosElement = document.createElement('p');
            serviciosElement.style.margin = '5px 0';
            serviciosElement.style.fontSize = '14px';
            serviciosElement.style.color = '#555';
            serviciosElement.textContent = `Servicios: ${servicios.join(', ')}`;
            popupContent.appendChild(serviciosElement);

            const verPerfilButton = document.createElement('p');
            verPerfilButton.textContent = 'Ver Perfil';
            verPerfilButton.style.color = 'blue';
            verPerfilButton.style.cursor = 'pointer';
            verPerfilButton.addEventListener('click', () => navigateToProfile(email));
            popupContent.appendChild(verPerfilButton);

            L.marker(marker.position, { icon: pinkIcon })
                .addTo(markerGroupRef.current)
                .bindPopup(popupContent);
        });
    }, [markers, map, navigateToProfile]);

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

const LocationFilters = ({ handleGeolocate, services, onServiceChange, onDomicilioClick }) => {
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
                onClick={onDomicilioClick}
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
            <select
                onChange={(e) => onServiceChange(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
            >
                <option value="">Selecciona un servicio</option>
                {services.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                ))}
            </select>
        </div>
    );
};

const SolicitudDomicilio = ({ onCancel }) => {
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [solicitudEnviada, setSolicitudEnviada] = useState(false);

    const handleSolicitar = () => {
        setSolicitudEnviada(true);
    };

    return (
        <div style={{ width: '20%', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {!solicitudEnviada ? (
                <>
                    <h3 style={{ marginBottom: '1rem' }}>Solicitud de Domicilio</h3>
                    <label>
                        Dirección:
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </label>
                    <label>
                        Teléfono:
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </label>
                    <button
                        onClick={handleSolicitar}
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
                        Solicitar
                    </button>
                </>
            ) : (
                <>
                    <p style={{ marginBottom: '1rem', color: 'green' }}>
                        Se envió tu solicitud. Esperando a que un profesional atienda.
                    </p>
                    <button
                        onClick={onCancel}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                </>
            )}
        </div>
    );
};

const MapPage = () => {
    const navigate = useNavigate();
    const userType = useSelector((state) => state.user.userType);
    const email = useSelector((state) => state.user.user.email);
    const [user, setUser] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); 
    const [showDomicilio, setShowDomicilio] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const userObj = await getUserByEmail(email);
            if (userObj) {
                setUser(userObj.usuario);
            }
        };
        fetchUser();
    }, [email]);

    useEffect(() => {
        const fetchProfiles = async () => {
            const profiles = await getAllProfiles();
            const allServices = profiles.flatMap(profile => profile.servicios);
            const uniqueServices = [...new Set(allServices)];

            setServices(uniqueServices);

            const formattedMarkers = profiles.map(profile => ({
                position: [profile.ubicación.lat, profile.ubicación.lng],
                title: profile.titulo,
                direccion: profile.dirección,
                descripcion: profile.descripción,
                servicios: profile.servicios,
                email: profile.profesionalEmail
            }));

            setMarkers(formattedMarkers);
            setProfiles(profiles);
        };
        fetchProfiles();
    }, []);

    useEffect(() => {
        let filteredMarkers = profiles;

        // Filtrar por servicio seleccionado
        if (selectedService) {
            filteredMarkers = filteredMarkers.filter(profile => profile.servicios.includes(selectedService));
        }

        // Filtrar por texto de búsqueda
        if (searchQuery) {
            filteredMarkers = filteredMarkers.filter(profile =>
                profile.titulo.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Actualizar los marcadores con los filtros aplicados
        setMarkers(
            filteredMarkers.map(profile => ({
                position: [profile.ubicación.lat, profile.ubicación.lng],
                title: profile.titulo,
                direccion: profile.dirección,
                descripcion: profile.descripción,
                servicios: profile.servicios,
                email: profile.profesionalEmail
            }))
        );
    }, [selectedService, searchQuery, profiles]);

    const navigateToProfile = (email) => {
        navigate('/Perfil', { state: { email } });
    };

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
                <div style={{ display: 'flex' }}>
                    {/* Barra de búsqueda */}
                    <input
                        type="text"
                        placeholder="Buscar"
                        style={{ padding: '0.5rem', borderRadius: '4px 0 0 4px', border: '1px solid #ccc' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Actualizar estado de búsqueda
                    />
                </div>
                <div>{user} | {userType}</div>
            </header>

            <div id="Menu" style={{ display: 'flex', flex: 1, padding: '2rem', gap: '1rem' }}>
            {showDomicilio ? (
                    <SolicitudDomicilio onCancel={() => setShowDomicilio(false)} />
                ) : (
                    <LocationFilters
                        handleGeolocate={handleGeolocate}
                        services={services}
                        onServiceChange={setSelectedService}
                        onDomicilioClick={() => setShowDomicilio(true)}
                    />
                )}

                <div style={{ flex: 1 }}>
                    <MapComponent markers={markers} onGeolocate={true} userLocation={userLocation} navigateToProfile={navigateToProfile} />
                </div>
            </div>
        </div>
    );
};

export default MapPage;

