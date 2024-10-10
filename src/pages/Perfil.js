//Pagina para los perfiles, que cambiara dependiendo de si es un profesional el ue mira su propio apartado (Puede hacer publicaciones y editarlo)
//o si es un cliente viendo el apartado de un profesional (solo puede dejar reseñas)
import React from 'react';

// Componente de perfil
const UserProfile = () => {
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
    };

    return (
        <div style={styles.body}>
            {/* Header */}
            <header style={styles.header}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '600' }}>Nails Express</h1>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button style={styles.btnGradient}>Editar</button>
                        <div style={{ fontSize: '1.125rem' }}>Nombre usuario | Profesional</div>
                    </div>
                </div>
            </header>

            {/* Contenedor del Perfil Profesional */}
            <section style={{ ...styles.section, ...styles.container, maxWidth: '1100px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginTop: '30px' ,padding: '   24px' }}>

                <div style={styles.profileContainer}>
                    {/* Foto de perfil */}
                    <div style={{ textAlign: 'center' }}>
                        <img style={styles.profileImage} src="https://via.placeholder.com/150" alt="Foto de perfil" />
                        {/* Nombre y Especialización */}
                        <div style={styles.nameContainer}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0' }}>María Pérez</h2>
                            <p style={{ color: '#4A5568', margin: '0' }}>Especialista en Manicure y Pedicure</p>
                        </div>
                    </div>
                    {/* Contenedor de descripción */}
                    <div style={styles.descriptionContainer}>
                        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4A5568' }}>Descripción</h3>
                            <p style={{ color: '#4A5568', margin: '8px 0' }}>
                                Con más de 5 años de experiencia, experta en técnicas como el gel y acrílico. Ofrece servicios a domicilio en Ciudad de México.
                            </p>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#4A5568', marginTop: '24px' }}>Ubicación</h3>
                            <p style={{ color: '#4A5568', marginBottom: '16px' }}>Ciudad de México</p>
                            <img src="https://via.placeholder.com/300x200" alt="Mapa de ubicación" style={{ marginTop: '16px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }} />
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
                                    <button style={styles.btnGradient}>Me Gusta</button>
                                    <span style={{ color: '#4A5568', marginLeft: '8px' }}>25 Likes</span>
                                </div>
                            </div>
                            <div style={styles.publicationBox}>
                                <img style={styles.publicationImage} src="https://via.placeholder.com/350x200" alt="Publicación 2" />
                                <h4 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Ofertas especiales de octubre</h4>
                                <p style={{ color: '#4A5568', marginBottom: '8px' }}>Este mes tengo ofertas especiales en servicios de manicure y pedicure. ¡No te lo pierdas!</p>
                                <div>
                                    <button style={styles.btnGradient}>Me Gusta</button>
                                    <span style={{ color: '#4A5568', marginLeft: '8px' }}>25 Likes</span>
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