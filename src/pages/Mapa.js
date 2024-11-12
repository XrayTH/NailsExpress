import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

const MapPage = () => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        // Inicializar el mapa
        const initialMap = L.map('map').setView([19.432608, -99.133209], 13); // Ciudad de México
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(initialMap);

        // Añadir marcadores
        const markers = [
            { position: [19.42847, -99.12766], title: 'Profesional 1' },
            { position: [19.4368, -99.1406], title: 'Profesional 2' },
            { position: [19.4412, -99.1558], title: 'Profesional 3' }
        ];

        markers.forEach(marker => {
            L.marker(marker.position)
              .addTo(initialMap)
              .bindPopup(marker.title);
        });

        setMap(initialMap);

        // Limpiar el mapa al desmontar
        return () => {
            initialMap.remove();
        };
    }, []);

    const handleGeolocate = () => {
        if (map) {
            map.locate({ setView: true, maxZoom: 16 });
        }
    };

    useEffect(() => {
        if (map) {
            map.on('locationfound', e => {
                L.marker(e.latlng)
                  .addTo(map)
                  .bindPopup('Estás aquí')
                  .openPopup();
            });

            map.on('locationerror', () => {
                alert("No se pudo encontrar tu ubicación");
            });
        }
    }, [map]);

    // Estilos en línea
    const styles = {
        container: {
            backgroundColor: "#f3f4f6", // bg-gray-100
            display: "flex",
            flexDirection: "column",
            height: "100vh",
        },
        navbar: {
            backgroundColor: "#ec4899", // bg-pink-500
            color: "white",
            padding: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        navbarTitle: {
            fontSize: "1.875rem", // text-3xl
            fontWeight: "bold",
        },
        navbarSearch: {
            height: "100%",
            display: "flex",
        },
        searchInput: {
            height: "66%",
            padding: "0.5rem",
            borderRadius: "0.375rem 0 0 0.375rem", // rounded-l-md
            border: "1px solid #ccc",
        },
        searchButton: {
            height: "100%",
            backgroundColor: "white",
            color: "#7e22ce", // text-purple-500
            padding: "0.5rem",
            borderRadius: "0 0.375rem 0.375rem 0", // rounded-r-md
            marginLeft: "-1px", // Para que se vea como un solo botón
            transition: "background 0.3s ease",
            border: "1px solid #7e22ce", // Bordes del botón
        },
        searchButtonHover: {
            backgroundColor: "#e5e7eb", // hover:bg-gray-200
        },
        navbarUser: {
            fontSize: "1.125rem", // text-lg
        },
        sidebar: {
            marginRight: "2rem",
            width: "18%",
            backgroundColor: "white",
            borderRadius: "0.625rem",
            padding: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Centra los elementos horizontalmente
        },
        sidebarTitle: {
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            textAlign: "center", // Centra el título
        },
        btnGradient: {
            background: "linear-gradient(90deg, rgba(127, 27, 221, 1) 0%, rgba(255, 105, 180, 1) 100%)",
            color: "white",
            padding: "0.75rem 1rem",
            borderRadius: "0.9rem",
            margin: "0.9rem 0",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "60%",
        },
        btnGradientHover: {
            transform: "scale(1.05)",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
        },
        leafletContainer: {
            height: "500px",
            width: "75%",
            borderRadius: "0.625rem",
        },
        serviceSelect: {
            padding: "0.5rem",
            borderRadius: "0.375rem",
            border: "1px solid #ccc",
            width: "60%",
            marginBottom: "1rem",
            outline: "none",
        },
    };

    return (
        <div style={styles.container}>
            <header style={styles.navbar}>
            <Link to="/inicioPro">
            <img 
                    src="https://i.imgur.com/QJTUutm.png" 
                    alt="Logo Nails Express" 
                    className="object-contain" 
    style={{ height: '50px', width: '200px' }}
                />
                </Link>
                <div style={styles.navbarSearch}>
                    <input type="text" placeholder="Buscar" style={styles.searchInput} />
                    <button
                        style={styles.searchButton}
                        onMouseOver={e => e.currentTarget.style.background = styles.searchButtonHover.backgroundColor}
                        onMouseOut={e => e.currentTarget.style.background = "white"}
                    >
                        Buscar
                    </button>
                </div>
                <div style={styles.navbarUser}>Nombre usuario | Profesional</div>
            </header>

            <div style={{ display: "flex", flex: 1, padding: "2rem" }}>
                <div style={styles.sidebar}>
                    <h3 style={styles.sidebarTitle}>Filtros de ubicación</h3>
                    <button 
                        id="geolocate" 
                        onClick={handleGeolocate} 
                        style={styles.btnGradient}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = styles.btnGradientHover.transform;
                            e.currentTarget.style.boxShadow = styles.btnGradientHover.boxShadow;
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                        }}
                    >
                        Geolocalizarme
                    </button>
                    <button 
                        style={styles.btnGradient}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = styles.btnGradientHover.transform;
                            e.currentTarget.style.boxShadow = styles.btnGradientHover.boxShadow;
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                        }}
                    >
                        Domicilio
                    </button>
                    <h3 style={styles.sidebarTitle}>Servicios</h3>
                    <select className="service-select" style={styles.serviceSelect}>
                        <option>Manicura</option>
                        <option>Pedicura</option>
                        <option>Uñas acrílicas</option>
                    </select>
                    <button 
                        style={styles.btnGradient}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = styles.btnGradientHover.transform;
                            e.currentTarget.style.boxShadow = styles.btnGradientHover.boxShadow;
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                        }}
                    >
                        Filtrar
                    </button>
                </div>

                <div id="map" style={styles.leafletContainer}></div>
            </div>
        </div>
    );
};

export default MapPage;