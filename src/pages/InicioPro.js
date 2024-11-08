import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../utils/firebase'; // Asegúrate de que la ruta sea correcta
import { useDispatch } from 'react-redux'; // Importa useDispatch
import { logout } from '../features/authSlice'; // Importa logout de authSlice
import { logoutUser } from '../features/userSlice'; // Importa logoutUser de userSlice

const InicioPro = () => {
    const dispatch = useDispatch(); // Crea el dispatch
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verifica el estado de autenticación del usuario
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsAuthenticated(!!user); // Cambia el estado según si hay un usuario
        });

        return () => unsubscribe(); // Limpiar el listener al desmontar el componente
    }, []);

    useEffect(() => {
        // Configurar meta etiquetas y enlaces al cargar el componente
        document.title = 'PAGINA PRINCIPAL';

        const metaCharset = document.createElement('meta');
        metaCharset.setAttribute('charset', 'UTF-8');
        document.head.appendChild(metaCharset);

        const metaViewport = document.createElement('meta');
        metaViewport.setAttribute('name', 'viewport');
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        document.head.appendChild(metaViewport);

        const tailwindLink = document.createElement('link');
        tailwindLink.setAttribute('href', 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
        tailwindLink.setAttribute('rel', 'stylesheet');
        document.head.appendChild(tailwindLink);

        const poppinsLink = document.createElement('link');
        poppinsLink.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        poppinsLink.setAttribute('rel', 'stylesheet');
        document.head.appendChild(poppinsLink);

        const styles = document.createElement('style');
        styles.innerHTML = `
            body {
                font-family: 'Poppins', sans-serif;
            }
            .hero-bg {
                background-image: url('/Nails-imagen.jpg');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }
            h2 {
                color: rgb(255, 255, 255);
                text-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
            }
            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #a47fc7;
                display: flex;
                justify-content: center;
                align-items: center;
                
            }
            .overlay img {
                 width: 100%;
            height: 100%; /* Mantiene la proporción de la imagen */
            object-fit: cover; /* Asegura que la imagen cubra el área especificada */
            background-color: #a959f5;
            opacity: 0.55;
            }
            .hero-content {
                position: relative;
                z-index: 2;
            }
            .btn-gradient {
                background: linear-gradient(90deg, rgba(127, 27, 221, 1) 0%, rgba(255, 105, 180, 1) 100%);
                transition: background 0.3s ease;
            }
            .btn-gradient:hover {
                background: linear-gradient(90deg, rgba(255, 105, 180, 1) 0%, rgba(127, 27, 221, 1) 100%);
            }
            .testimonios-bg {
                background-color: rgba(127, 27, 221, 0.1);
            }
        `;
        document.head.appendChild(styles);

        return () => {
            document.head.removeChild(metaCharset);
            document.head.removeChild(metaViewport);
            document.head.removeChild(tailwindLink);
            document.head.removeChild(poppinsLink);
            document.head.removeChild(styles);
        };
    }, []);

    const handleLogout = async () => {
        await dispatch(logout()); // Despacha la acción de logout
        await dispatch(logoutUser()); // Despacha la acción de logoutUser
    };

    return (
        <div className="bg-gray-100">
            <Navbar onLogout={handleLogout} />
            <HeroSection isAuthenticated={isAuthenticated} />
            <CallToAction />
            <Testimonials />
        </div>
    );
};

const Navbar = ({ onLogout }) => {
    return (
        <header className="bg-pink-600 text-white shadow-md">
            <div className="container mx-auto p-4 flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Nails Express</h1>
                <div>
                <Link to="/Perfil">
                        <button className="bg-white text-purple-500 py-2 px-4 rounded-full hover:bg-gray-200 mr-2">
                            Ver Perfil
                        </button>
                    </Link>
                    <Link to="/Mapa">
                        <button className="bg-white text-purple-500 py-2 px-4 rounded-full hover:bg-gray-200 mr-2">
                            Ver Solicitudes
                        </button>
                    </Link>
                    <button onClick={onLogout} className="bg-white text-purple-500 py-2 px-4 rounded-full hover:bg-gray-200 mr-2">
                        Cerrar Sesión
                    </button>
                    <div style={{ fontSize: '1.125rem' }}>Nombre usuario | Profesional</div>
                </div>
            </div>
        </header>
    );
};

const HeroSection = ({ isAuthenticated }) => {
    return (
        <section className="hero-bg">
            <div className="overlay">
                <img src="https://cms.modumb.com/storage/magazine/_800x422/manicura-3102.jpg" alt="foto" />
            </div>
            <div className="hero-content text-center text-white">
                <h2 className="text-5xl font-semibold mb-4">{isAuthenticated ? 'Bienvenido de nuevo!' : 'Manicure a Domicilio'}</h2>
                <p className="text-xl mb-8">{isAuthenticated ? 'Gracias por ser parte de nuestra comunidad.' : 'Reserva tu servicio con los mejores profesionales cerca de ti'}</p>
                <Link to="/Mapa">
                    <button className="btn-gradient text-white py-3 px-6 rounded-full text-lg">
                        {isAuthenticated ? 'Explorar Servicios' : 'Reserva Ahora'}
                    </button>
                </Link>
            </div>
        </section>
    );
};

const CallToAction = () => {
    return (
        <section className="bg-pink-100 py-12">
            <div className="container mx-auto text-center">
                <h3 className="text-4xl font-semibold text-gray-800 mb-6">Encuentra a tus clientes cerca de ti</h3>
                <Link to="/mapa">
                    <button className="btn-gradient text-white py-3 px-6 rounded-full text-lg">
                        Ver Clientes
                    </button>
                </Link>
            </div>
        </section>
    );
};

const Testimonials = () => {
    const testimonios = [
        {
            texto: 'Trabajar a través de esta plataforma ha sido una experiencia enriquecedora. Mis clientes están satisfechos y las reservas son fáciles de gestionar.',
            autor: 'Juan M.| estilista'
        },
        {
            texto: 'Me ha permitido ampliar mi base de clientes sin preocuparme por el manejo de pagos. ¡Es perfecto para los profesionales!',
            autor: 'Carla S.| manicurista'
        },
        {
            texto: 'Gracias a esta plataforma, tengo la libertad de organizar mis horarios y ofrecer un servicio personalizado. Es una gran herramienta para profesionales.',
            autor: 'Miguel R.| masajista'
        }
    ];

    return (
        <section className="testimonios-bg py-12">
            <div className="container mx-auto text-center">
                <h3 className="text-3xl font-semibold text-gray-800 mb-6">Lo que dicen nuestros Profesionales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonios.map((testimonio, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-gray-600">"{testimonio.texto}"</p>
                            <div className="mt-4 text-pink-500 font-semibold">- {testimonio.autor}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default InicioPro;