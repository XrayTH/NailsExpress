import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { getProfileByEmail, updateProfile } from '../services/profileService';
import { getProfesionalByEmail } from '../services/profesionalService';
import { getReviewsByEmail, addReview, getAverageRating } from '../services/reviewService'
import { getPublicationsByEmail, addPublication } from '../services/publicationService'
import { selectUser } from '../features/userSlice';  // Ajusta la ruta
import { uploadImage } from '../services/imageService';

const CustomMap = ({ coordinates, updateLocation }) => {
    const [markerPosition, setMarkerPosition] = useState({ lat: coordinates.lat, lng: coordinates.lng });

    const customIcon = L.icon({
        iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png',
        iconSize: [32, 32], // Tamaño del ícono
        iconAnchor: [16, 32], // Punto del ícono que se posiciona en las coordenadas
        popupAnchor: [0, -32], // Punto desde el cual se abre el popup hacia arriba
      });

    
    return (
        <MapContainer
        center={[markerPosition.lat, markerPosition.lng]}
        zoom={13}
        style={{
            width: '300px',
            height: '200px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
        whenReady={(map) => {
            map.target.on('click', (e) => {
                setMarkerPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
                updateLocation( e.latlng.lat, e.latlng.lng )
            });
        }}
    >
    
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[markerPosition.lat, markerPosition.lng]} icon={customIcon}>
            <Popup>Ubicación</Popup>
        </Marker>
      </MapContainer>
    );
  };

const UserPerfile = () => {
    const location = useLocation();
    const [rating, setRating] = useState(0);
    const [hoveredTag, setHoveredTag] = useState(null);
    const [profesional, setProfesional] = useState('');
    const [profile, setProfile] = useState('');
    const [reviews, setReviews] = useState([])
    const [publications, setPublications] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector(selectUser);
    const tipoUsuario = useSelector((state) => state.user.userType);
    const [isEditing, setIsEditing] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState(5);

    useEffect(() => {
        let email = null

        if (!user) {
            setError("No se ha iniciado sesión");
            setLoading(false);
            return;
        }else if(tipoUsuario === 'profesional'){
            email = user.email;
        }else{
            email = location.state?.email
        }
    
        // Función que simula la obtención de datos de manera paralela
        const fetchData = async () => {
            try {
    
                // Ejecutar ambas solicitudes en paralelo
                const [profesionalData, profileData, reviewsData, rankingData, publicationsData] = await Promise.all([
                    getProfesionalByEmail(email),
                    getProfileByEmail(email),
                    getReviewsByEmail(email),
                    getAverageRating(email),
                    getPublicationsByEmail(email)
                ]);
    
                // Actualizar estados con los datos obtenidos
                setProfesional(profesionalData);
                setProfile(profileData);
                setReviews(reviewsData)
                setRating(rankingData.promedio)
                setPublications(publicationsData.listaPublicaciones)
            } catch (error) {
                setError(error.message || "Error al obtener datos");
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [user, location, tipoUsuario]);   
    
    const handleAddTag = () => {
        if (newTag && !profile.servicios.includes(newTag.toLowerCase())) {
            setProfile({
                ...profile,
                servicios: [...profile.servicios, newTag.toLowerCase()],
            });
            setNewTag(""); // Limpiar el campo de texto
        }
    };
    
    const handleRemoveTag = (tagToRemove) => {
        setProfile({
            ...profile,
            servicios: profile.servicios.filter((tag) => tag !== tagToRemove),
        });
    };

    const updateLocation = (lat, lng) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            ubicación: { lat, lng },
        }));
        console.log(lat, lng)
    };

    const handleSaveProfile = async () => {
        try {
            // Verifica si el email está disponible
            if (!user?.email) {
                throw new Error('Email no disponible');
            }
            console.log(profile)
    
            // Realiza la actualización del perfil en la base de datos
            await updateProfile(user.email, profile); // Llama al método de actualización con el email y el objeto profile actualizado
    
            // Puedes mostrar un mensaje de éxito, o realizar otras acciones
            alert('Perfil actualizado correctamente');
            
            // Cambiar el estado de "editar" a "no editar"
            setIsEditing(false);
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            alert('Hubo un error al actualizar el perfil. Intenta nuevamente.');
        }
    };   

    const handleAddPublication = async () => {
        try {
            // Verifica si el título y contenido no están vacíos
            if (!titulo || !contenido) {
                alert('Por favor ingrese un título y contenido para la publicación.');
                return;
            }
    
            // Llama a la función addPublication pasándole el email del usuario y los datos de la publicación
            await addPublication(user.email, { titulo, contenido });
    
            // Después de agregar la publicación, puedes limpiar los campos
            setTitulo('');
            setContenido('');
    
            // Actualiza las publicaciones en el estado para reflejar la nueva publicación
            const updatedPublications = await getPublicationsByEmail(user.email);
            setPublications(updatedPublications.listaPublicaciones);
    
            alert('Publicación realizada con éxito');
        } catch (error) {
            console.error('Error al agregar la publicación:', error);
            alert('Hubo un error al realizar la publicación. Intenta nuevamente.');
        }
    };   
    
    const handleAddReview = async () => {
        try {
            // Verifica si la reseña y calificación son válidas
            if (!reviewContent || reviewRating < 1 || reviewRating > 5) {
                alert('Por favor, ingresa una reseña válida y una calificación entre 1 y 5.');
                return;
            }
    
            // Llama a la función addReview pasándole los datos
            await addReview(location.state?.email || user.email, {
                usuarioCliente: user.email,  // Aquí usamos el email del usuario como 'usuarioCliente'
                contenido: reviewContent,
                calificación: reviewRating
            });
    
            // Limpiar los campos después de agregar la reseña
            setReviewContent('');
            setReviewRating(0);
    
            // Actualizar las reseñas en el estado
            const updatedReviews = await getReviewsByEmail(user.email);
            setReviews(updatedReviews);
    
            alert('Reseña publicada con éxito');
        } catch (error) {
            console.error('Error al agregar la reseña:', error);
            alert('Hubo un error al publicar la reseña. Intenta nuevamente.');
        }
    };    

    if (loading) {
        return <div>Cargando...</div>; // Puedes mostrar un loader mientras se cargan los datos
    }

    if (error) {
        return <div>Error al cargar la información del perfil: {error} </div>; // Manejo de errores si los datos no están disponibles
    }

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

  // Renderizar el componente Perfil
  return (
        <div>
            <div style={styles.body}>
                {/* Header */}
                <header style={styles.header}>
                    <div style={{ maxWidth: '2000px', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to={"/"}>
                            <img
                                src='https://i.imgur.com/QJTUutm.png'
                                alt="Logo Nails Express"
                                className="object-contain"
                                style={{ height: '50px', width: '200px' }}
                            />
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.125rem', marginRight:'30px' }}>
                                {profesional.usuario || 'Name'} | {tipoUsuario || 'Tipo'}
                            </div>
                            {tipoUsuario === "profesional" && (
                                <button
                                    style={styles.btnGradient}
                                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(!isEditing)} // Llama a handleSaveProfile si está en modo edición
                                >
                                    {isEditing ? "Guardar" : "Editar"}
                                </button>
                                )}
                        </div>
                    </div>
                </header>

                {/* Contenedor del Perfil */}
                <section style={{ ...styles.section, ...styles.container, maxWidth: '1050px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginTop: '30px' ,padding: '   24px' }}>

                    <div style={styles.profileContainer}>
                        {/* Foto de perfil */}
                        <div style={{ textAlign: 'center' }}>

                        <img
                            style={styles.profileImage}
                            src={profile.imagen || profile.imagen !== "" ? process.env.REACT_APP_IMAGES_URL+"/image/"+profile.imagen : 'https://via.placeholder.com/150'}
                            alt="Foto de perfil"
                            onClick={() => isEditing && document.getElementById('fileInput').click()}
                        />
                        <input
                            id="fileInput"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const formData = new FormData();
                                    formData.append('image', file);
                                    try {
                                        const imageUrl = await uploadImage(formData); 
                                        setProfile((prevProfile) => ({
                                            ...prevProfile,
                                            imagen: imageUrl.filename
                                        }));
                                    } catch (error) {
                                        console.error("Error al subir la imagen", error);
                                    }
                                }
                            }}
                        />

                            {/* Nombre y Especialización */}
                            <div style={styles.nameContainer}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0' }}>
                                {isEditing ? (
                                    <input 
                                    type="text" 
                                    value={profile.titulo} 
                                    onChange={(e) => setProfile({...profile, titulo: e.target.value})} 
                                    style={{ fontSize: '1.5rem', width: '100%' }}
                                    />
                                ) : (
                                    profile.titulo || 'Nombre del Local'
                                )}
                                </h2>
                                {/* Reseñas y Estrellas */}
                                <div style={styles.ratingContainer}>
                                    {[...Array(5)].map((_, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                ...styles.star,
                                                ...(rating > index ? { color: 'yellow' } : {}),
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                    {/* Mostrar el valor de la calificación */}
                                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                        <h4>Calificación: {rating.toFixed(2) || 1} </h4>
                                    </div>
                            </div>
                        </div>

                        {/* Contenedor de Descripción y Ubicación en el mismo contenedor */}
                        <div style={{ ...styles.descriptionContainer, display: 'flex', alignItems: 'flex-start' ,borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',padding: '   24px'  }}>
                            {/* Descripción */}
                            <div style={{ flex: 1, paddingRight: '20px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4A5568' }}>Descripción</h3>
                                <p style={{ color: '#4A5568', margin: '8px 0' }}>
                                    {isEditing ? (
                                        <textarea 
                                        value={profile.descripción} 
                                        onChange={(e) => setProfile({...profile, descripción: e.target.value})} 
                                        style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f7fafc' }}
                                        />
                                    ) : (
                                        profile.descripción
                                    )}
                                </p>
                                {/* Etiquetas interactivas */}
                                <div style={{ marginTop: '20px' }}>
                                    {isEditing && (
                                        <div style={{ marginBottom: '10px' }}>
                                            <input
                                                type="text"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                placeholder="Nueva etiqueta"
                                                style={{
                                                    padding: '5px 10px',
                                                    fontSize: '0.875rem',
                                                    borderRadius: '15px',
                                                    border: '1px solid #ccc',
                                                    backgroundColor: '#f7fafc',
                                                }}
                                            />
                                            <button
                                                onClick={handleAddTag}
                                                style={{
                                                    marginLeft: '10px',
                                                    backgroundColor: '#ec4899',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '15px',
                                                    padding: '5px 10px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Añadir
                                            </button>
                                        </div>
                                    )}
                                    {profile.servicios.map((tag) => (
                                        <span
                                            key={tag}
                                            style={hoveredTag === tag ? { ...styles.tag, ...styles.tagHover } : styles.tag}
                                            onMouseEnter={() => setHoveredTag(tag)}
                                            onMouseLeave={() => setHoveredTag(null)}
                                        >
                                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                            {isEditing && (
                                                <button
                                                    onClick={() => handleRemoveTag(tag)}
                                                    style={{
                                                        marginLeft: '5px',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'red',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        {/* Ubicación */}
                            <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4A5568' }}>Direccion</h3>
                                    <p style={{ color: '#4A5568', marginBottom: '16px' }}>
                                        {isEditing ? (
                                            <input 
                                            type="text" 
                                            value={profile.dirección} 
                                            onChange={(e) => setProfile({...profile, dirección: e.target.value})} 
                                            style={{ width: '100%' }}
                                            />
                                        ) : (
                                            profile.dirección
                                        )}
                                        </p>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ marginBottom: '10px' }}>
                             </div>

                        {/* Aquí va el mapa */}
                        <CustomMap coordinates={profile.ubicación} updateLocation={updateLocation}/>
                        </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Contenedor de Reseñas y Publicaciones */}
                <section style={{ ...styles.section, ...styles.container , maxWidth: '1100px' }}>
                    <div style={styles.reviewsAndPublications}>
                        {/* Contenedor de Reseñas */}
                        <div style={{ ...styles.reviewAndPublicationBox, background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4A5568', marginBottom: '16px' }}>Reseñas</h3>
                            <div style={styles.reviewContainer}>
                                    {tipoUsuario === "cliente" && (
                                        <div style={styles.reviewBox}>
                                            <textarea
                                            style={styles.textareaBox}
                                            placeholder="Escribe tu reseña aquí..."
                                            value={reviewContent}
                                            onChange={(e) => setReviewContent(e.target.value)}
                                            ></textarea>
                                            <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={reviewRating}
                                            onChange={(e) => setReviewRating(parseInt(e.target.value))}
                                            style={styles.inputRatingBox}
                                            placeholder="Calificación (1-5)"
                                            />
                                            <div style={{ marginTop: '10px' }}>
                                            <button style={styles.btnGradient} onClick={handleAddReview}>Publicar Reseña</button>
                                            </div>
                                            </div>
                                        )}
                                {reviews.length === 0 ? (
                                    <p style={{ color: '#4A5568' }}>No hay reseñas</p>
                                ) : (
                                    reviews.map((review, index) => (
                                        <div key={index} style={styles.reviewBox}>
                                            <p style={{ color: '#4A5568', fontWeight: 'bold' }}>{review?.usuarioCliente}:</p>
                                            <p style={{ color: '#4A5568' }}>{review?.contenido}</p>
                                            <p style={{ color: '#4A5568' }}>
                                                {
                                                    Array.from({ length: Math.floor(review?.calificación) }).map((_, index) => (
                                                        <span key={index}>★</span>
                                                    ))
                                                }
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Contenedor de Publicaciones */}
                        <div style={{ ...styles.reviewAndPublicationBox, background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4A5568', marginBottom: '16px' }}>Publicaciones Recientes</h3>
                            <div style={styles.publicationsContainer}>
                                {/* Textarea para comentarios o publicaciones nuevas */}
                                {tipoUsuario === "profesional" && (
                                    <>
                                        <input
                                        type="text"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        placeholder="Título aquí..."
                                        style={styles.inputBox}
                                        />

                                        <textarea
                                        value={contenido}
                                        onChange={(e) => setContenido(e.target.value)}
                                        style={styles.textareaBox}
                                        placeholder="Escribe tu publicación o comentario aquí..."
                                        ></textarea>

                                        <button style={styles.btnGradient} onClick={handleAddPublication}>Publicar</button>
                                    </>
                                    )}
                                {/* Mostrar las publicaciones si existen, o un mensaje si está vacío */}
                                {publications.length === 0 ? (
                                <p style={{ color: '#4A5568', fontSize: '1rem', fontWeight: '600' }}>No hay publicaciones</p>
                                ) : (
                                publications.map((publication, index) => (
                                    <div key={index} style={styles.publicationBox}>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{publication.titulo}</h4>
                                    <p style={{ color: '#4A5568', marginBottom: '8px' }}>{publication.contenido}</p>
                                    </div>
                                ))
                                )}
                            </div>
                            </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserPerfile;