//Pagina para los perfiles, que cambiara dependiendo de si es un profesional el ue mira su propio apartado (Puede hacer publicaciones y editarlo)
//o si es un cliente viendo el apartado de un profesional (solo puede dejar reseñas)
import React from 'react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
//import L from 'leaflet';

// Asegúrate de importar los estilos de Leaflet
import 'leaflet/dist/leaflet.css';

// El resto de tu código


// Componente de perfil
const UserProfile = () => {
    const [rating, setRating] = useState(0); // Estado para manejar el puntaje seleccionado
    const [averageRating, setAverageRating] = useState(0); // Promedio de calificación
    const [hoveredTag, setHoveredTag] = useState(null);// etiquetas

    // Al cargar el componente, obtenemos las calificaciones anteriores del localStorage
    useEffect(() => {
        const savedRatings = JSON.parse(localStorage.getItem('ratings')) || [];
        const average = savedRatings.length > 0 ? savedRatings.reduce((acc, curr) => acc + curr, 0) / savedRatings.length : 0;
        setAverageRating(average);
    }, [])

// Estado que guarda si le gusta o no
const [liked, setLiked] = useState(false);

// Función para cambiar el estado de 'liked'
const handleLike = () => {
    setLiked(!liked); // Cambia el estado de 'liked' al opuesto
};

    const handleRating = (index) => {
        const newRating = index + 1; // Las estrellas se indexan desde 0, pero la calificación va de 1 a 5

        // Guardamos la nueva calificación en el localStorage
        const savedRatings = JSON.parse(localStorage.getItem('ratings')) || [];
        savedRatings.push(newRating);
        localStorage.setItem('ratings', JSON.stringify(savedRatings));

        // Recalculamos el promedio
        const average = savedRatings.reduce((acc, curr) => acc + curr, 0) / savedRatings.length;
        setAverageRating(average);

        // Actualizamos la calificación visualmente
        setRating(newRating);
    };

    const position = [51.505, -0.09];

    const styles = {
        body: {
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: 'rgba(127, 27, 221, 0.1)',
            margin: 0,
            padding: 0,
        },
        btnGradient: {
            background: 'linear-gradient(90deg, rgba(127, 27, 221, 1) 0%, rgba(255, 105, 180, 1) 100%)',
            transition: 'background 0.3s ease',
            padding: '10px 20px',
            borderRadius: '25px',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            //marginTop: '20px',
        },
        btnGradientHover: {
            background: 'linear-gradient(90deg, rgba(255, 105, 180, 1) 0%, rgba(127, 27, 221, 1) 100%)',
        },
        reviewContainer: {
            maxHeight: '400px',
            overflowY: 'scroll',
            paddingRight: '10px',
        },
        reviewBox: {
            marginTop: '20px',
            backgroundColor: '#f7fafc',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '10px',
        },
        publicationsContainer: {
            maxHeight: '400px',
            overflowY: 'scroll',
        },
        publicationBox: {
            backgroundColor: '#f7fafc',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '15px',
        },
        textareaBox: {
            width: '100%',
            padding: '10px',
            marginTop: '20px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#f7fafc',
            resize: 'none',
            height: '100px',
        },
        header: {
            backgroundColor: '#ec4899',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
        },
        section: {
            margin: '12px 0',
        },
        profileImage: {
            borderRadius: '50%',
            border: '3px solid #ccc',
            width: '150px',
            height: '150px',
        },
        publicationImage: {
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
        },
        profileContainer: {
            display: 'flex',
            alignItems: 'center',
        },
        descriptionContainer: {
            marginLeft: '20px',
        },
        nameContainer: {
            textAlign: 'center',
            marginTop: '10px',
        },
        reviewsAndPublications: {
            display: 'flex',
            gap: '16px',
            justifyContent: 'space-between',
        },
        reviewAndPublicationBox: {
            flex: '1',
            minWidth: '300px', // Ancho mínimo para cada contenedor
        },

        ratingContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '5px',
            marginTop: '8px',
        },
        star: {
            fontSize: '2rem',
            cursor: 'pointer',
            color: '#ddd', // Color predeterminado de las estrellas
            transition: 'color 0.3s',
        },
        starHover: {
            color: 'yellow', // Color al pasar el mouse
        },
        starActive: {
            color: 'orange', // Color cuando se haga clic
        },
        
        tag: {
            display: 'inline-block',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            padding: '8px 12px',
            borderRadius: '15px',
            fontSize: '0.875rem',
            marginTop: '10px',
            marginRight: '5px',
            transition: 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
        },
        
        tagHover: {
            backgroundColor: '#ff69b4',  // Cambia a rosa al pasar el cursor
            color: 'white',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        },
    };


    return (
        <div style={styles.body}>
            {/* Header */}
            <header style={styles.header}>
                <div style={{ maxWidth: '2000px', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/inicioPro">
            <img 
                    src="https://i.imgur.com/QJTUutm.png" 
                    alt="Logo Nails Express" 
                    className="object-contain" 
    style={{ height: '50px', width: '200px' }}
                />
                </Link>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.125rem', marginRight:'30px' }}>Nombre usuario | Profesional</div>
                        <button style={styles.btnGradient }>Editar</button>
                    </div>
                </div>
            </header>

            {/* Contenedor del Perfil Profesional */}
            <section style={{ ...styles.section, ...styles.container, maxWidth: '1050px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginTop: '30px' ,padding: '   24px' }}>

                <div style={styles.profileContainer}>
                    {/* Foto de perfil */}
                    <div style={{ textAlign: 'center' }}>
                       <img style={styles.profileImage} src="https://via.placeholder.com/150" alt="Foto de perfil" />
                       {/* Nombre y Especialización */}
                       <div style={styles.nameContainer}>
                       <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0' }}>María Pérez</h2>
                       <p style={{ color: '#4A5568', margin: '0' }}>Especialista en Manicure y Pedicure</p>
                       {/* Reseñas y Estrellas */}
                       <div style={styles.ratingContainer}>
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        className="star"
                                        style={{
                                            ...styles.star,
                                            ...(rating > index ? { color: 'yellow' } : {}),
                                        }}
                                        onMouseEnter={(e) => (e.target.style.color = 'yellow')}
                                        onMouseLeave={(e) => (e.target.style.color = rating > index ? 'yellow' : '#ddd')}
                                        onClick={() => handleRating(index)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                              {/* Mostrar el promedio de las calificaciones */}
                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                            <h4>Calificación: {averageRating.toFixed(1)} / 5</h4>
                            </div>
                        </div>
                    </div>

        {/* Contenedor de Descripción y Ubicación en el mismo contenedor */}
        <div style={{ ...styles.descriptionContainer, display: 'flex', alignItems: 'flex-start' ,borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',padding: '   24px'  }}>
            {/* Descripción */}
            <div style={{ flex: 1, paddingRight: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4A5568' }}>Descripción</h3>
                <p style={{ color: '#4A5568', margin: '8px 0' }}>
                    Con más de 5 años de experiencia, experta en técnicas como el gel y acrílico. Ofrece servicios a domicilio en Ciudad de México.
                </p>
                {/* Etiquetas interactivas */}
                <div style={{ marginTop: '20px' }}>
        <span 
            style={hoveredTag === 'manicure' ? { ...styles.tag, ...styles.tagHover } : styles.tag}
            onMouseEnter={() => setHoveredTag('manicure')}
            onMouseLeave={() => setHoveredTag(null)}
        >
            Manicure
        </span>
        <span 
            style={hoveredTag === 'pedicure' ? { ...styles.tag, ...styles.tagHover } : styles.tag}
            onMouseEnter={() => setHoveredTag('pedicure')}
            onMouseLeave={() => setHoveredTag(null)}
        >
            Pedicure
        </span>
        <span 
            style={hoveredTag === 'acrylic' ? { ...styles.tag, ...styles.tagHover } : styles.tag}
            onMouseEnter={() => setHoveredTag('acrylic')}
            onMouseLeave={() => setHoveredTag(null)}
        >
            Uñas Acrílicas
        </span>
        <span 
            style={hoveredTag === 'gelish' ? { ...styles.tag, ...styles.tagHover } : styles.tag}
            onMouseEnter={() => setHoveredTag('gelish')}
            onMouseLeave={() => setHoveredTag(null)}
        >
            Gelish
        </span>
    </div>

            </div>

            {/* Ubicación */}
            <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4A5568' }}>Ubicación</h3>
                <p style={{ color: '#4A5568', marginBottom: '16px' }}>Ciudad de México</p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '10px' }}>
        {/* Aquí va la imagen que mencionabas 
        <img 
          src="https://via.placeholder.com/300x200" 
          alt="Mapa de ubicación" 
          style={{ 
            borderRadius: '8px', 
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
            width: '300px', 
            height: '200px' 
          }} 
        />*/}
      </div>

      {/* Aquí va el mapa */}
      <MapContainer center={position} zoom={13} style={{ width: '300px', height: '200px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />
        <Marker position={position}>
          <Popup>
            Este es un marcador de ubicación.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
            </div>
        </div>

                </div>
            </section>

            {/* Contenedor de Reseñas y Publicaciones */}
            <section style={{ ...styles.section, ...styles.container , maxWidth: '1100px' }}>
                <div style={styles.reviewsAndPublications}>
                    {/* Contenedor de Reseñas con scroll */}
                    <div style={{ ...styles.reviewAndPublicationBox, background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4A5568', marginBottom: '16px' }}>Reseñas</h3>
                        <div style={styles.reviewContainer}>
                            {/* Textarea para comentarios o publicaciones nuevas */}
                            <textarea style={styles.textareaBox} placeholder="Escribe tu publicación o comentario aquí..."></textarea>
                            <button style={styles.btnGradient} >Publicar</button>
                            {/* Cada reseña en su propio contenedor */}
                            <div style={styles.reviewBox}>
                                <p style={{ color: '#4A5568' }}>"María es increíble, siempre puntual y muy profesional. ¡Recomendadísima!" - Andrea P.</p>
                            </div>
                            <div style={styles.reviewBox}>
                                <p style={{ color: '#4A5568' }}>"Excelente servicio, el mejor que he recibido en mucho tiempo." - Carla G.</p>
                            </div>
                            <div style={styles.reviewBox}>
                                <p style={{ color: '#4A5568' }}>"Siempre ofrece un trabajo de calidad. Estoy encantada con sus servicios." - Lucía R.</p>
                            </div>
                        </div>
                    </div>

                    {/* Contenedor de Publicaciones con scroll y botones */}
                    <div style={{ ...styles.reviewAndPublicationBox, background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4A5568', marginBottom: '16px' }}>Publicaciones Recientes</h3>
                        <div style={styles.publicationsContainer}>
                            {/* Textarea para comentarios o publicaciones nuevas */}
                            <textarea style={styles.textareaBox} placeholder="Escribe tu publicación o comentario aquí..."></textarea>
                            <button style={styles.btnGradient} >Publicar</button>

                            <div style={styles.publicationBox}>
                                <img style={styles.publicationImage} src="https://via.placeholder.com/350x200" alt="Publicación 1" />
                                <h4 style={{ fontSize: '1.25rem', fontWeight: '600' }}>¡Nuevos diseños!</h4>
                                <p style={{ color: '#4A5568', marginBottom: '8px' }}>¡Mira los nuevos diseños que tengo para esta temporada! ¡Te encantarán!</p>
                                <div>
                                <button 
                                 style={{ ...styles.btnGradient, display: 'flex', alignItems: 'center', marginTop: '20px' }}
                                 onClick={handleLike}
                                >
                                <svg 
                                 xmlns="http://www.w3.org/2000/svg" 
                                 width="24" 
                                 height="24" 
                                fill={liked ? 'red' : 'none'} 
                                viewBox="0 0 24 24" 
                                stroke={liked ? 'red' : 'currentColor'}
                               >
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/>
                                 </svg>
                                     </button>
                                    <span style={{ color: '#4A5568', marginLeft: '8px' }}>25 Likes</span>
                                </div>
                            </div>
                            <div style={styles.publicationBox}>
                                <img style={styles.publicationImage} src="https://via.placeholder.com/350x200" alt="Publicación 2" />
                                <h4 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Ofertas especiales de octubre</h4>
                                <p style={{ color: '#4A5568', marginBottom: '8px' }}>Este mes tengo ofertas especiales en servicios de manicure y pedicure. ¡No te lo pierdas!</p>
                                <div>
                                <button 
                                 style={{ ...styles.btnGradient, display: 'flex', alignItems: 'center' }}
                                 onClick={handleLike}
                                >
                                <svg 
                                 xmlns="http://www.w3.org/2000/svg" 
                                 width="24" 
                                 height="24" 
                                fill={liked ? 'red' : 'none'} 
                                viewBox="0 0 24 24" 
                                stroke={liked ? 'red' : 'currentColor'}
                               >
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/>
                                 </svg>
                                     </button>
                                    <span style={{ color: '#4A5568', marginLeft: '8px'}}>25 Likes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
export default UserProfile;