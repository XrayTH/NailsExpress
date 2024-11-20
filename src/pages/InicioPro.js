import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { auth } from '../utils/firebase'; // Asegúrate de que la ruta sea correcta
import { useDispatch } from 'react-redux'; // Importa useDispatch
import { logout } from '../features/authSlice'; // Importa logout de authSlice
import { logoutUser } from '../features/userSlice'; // Importa logoutUser de userSlice
import { getProfesionalByEmail } from '../services/profesionalService';

const InicioPro = () => {
    const dispatch = useDispatch(); // Crea el dispatch
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState('');


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsAuthenticated(!!user); // Cambia el estado según si hay un usuario
            if (user) {
                // Obtener el nombre del profesional usando el correo
                getProfesionalByEmail(user.email)
                    .then(profesional => {
                        setNombreUsuario(profesional.usuario); // Asumiendo que 'nombre' es el campo que quieres mostrar
                    })
                    .catch(error => {
                        console.error('Error fetching professional:', error);
                    });
            }
        });
    
        return () => unsubscribe();
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
                height: 100%;
                object-fit: cover;
                opacity: 0.55;
                background-color: #a959f5;
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
            <Navbar onLogout={handleLogout} nombreUsuario={nombreUsuario} />

            <HeroSection isAuthenticated={isAuthenticated} />
            <CallToAction />
            <Testimonials />
        </div>
    );
};

const Navbar = ({ onLogout, nombreUsuario }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const location = useLocation(); // Obtener la ruta actual

    const handleLogoClick = () => {
        // Si ya estamos en la página principal, recarga la página
        if (location.pathname === '/') {
            window.location.reload();
        }
    };

    return (
        <header className="bg-pink-600 text-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto p-4 flex justify-between items-center">
                <Link to="/inicioPro" onClick={handleLogoClick}>
                    <img 
                        src="https://i.imgur.com/QJTUutm.png" 
                        alt="Logo Nails Express" 
                        className="object-contain" 
                        style={{ height: '50px', width: '200px' }}
                    />
                </Link>

                <div className="flex items-center space-x-4">
                    {!menuOpen && (
                        <div className="text-lg">{nombreUsuario ? `${nombreUsuario} | Profesional` : 'Cargando...'}</div>
                    )}
                    <button
                        onClick={toggleMenu}
                        className="w-10 h-10 flex items-center justify-center bg-white text-pink-600 rounded-full shadow-md focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                className={`fixed top-0 right-0 h-full bg-pink-600 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'} w-64 z-50`}
            >
                <div className="p-6">
                    <button
                        onClick={toggleMenu}
                        className="text-white absolute top-4 right-4 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 4a1 1 0 000 2h8a1 1 0 100-2H6zM4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm2 4a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <h2 className="text-2xl font-semibold mb-6">{nombreUsuario ? `${nombreUsuario} | Profesional` : 'Cargando...'}</h2>

                    <nav className="flex flex-col space-y-4">
                        <Link to="/Perfil" className="hover:text-gray-200 text-lg">Ver perfil</Link>
                        <Link to="/Mapa" className="hover:text-gray-200 text-lg">Ver mapa</Link>
                        <button
                            onClick={onLogout}
                            className="hover:text-gray-200 text-lg text-left"
                        >
                            Cerrar sesión
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

const HeroSection = ({ isAuthenticated }) => {
    const images = [
        'https://www.cursosypostgrados.com/blog/wp-content/uploads/2024/09/manicura-chicadeazul.webp',
        'https://cms.modumb.com/storage/magazine/_800x422/manicura-3102.jpg',
        'https://media.istockphoto.com/photos/pink-red-manicure-and-makeup-picture-id899104114?k=6&m=899104114&s=612x612&w=0&h=eO5CZpp75TP9lyrBfH6TuT00wnGoYAhdp0ff9GuODIs=',
        'https://images.squarespace-cdn.com/content/v1/51a00dbce4b0d31a97ad5f09/1570368832331-805SXMFAE8F05W6XID33/iStock-171378559+(1).jpg',
        'https://th.bing.com/th/id/OIP.x0NEmg8BTa-D0PaxePFJcgHaEK?rs=1&pid=ImgDetMain'
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Cambia de imagen cada 5 segundos

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, [images.length]);

    return (
        <section className="hero-bg">
            <div className="overlay">
            <img src={images[currentImageIndex]} alt="Hero imagen" />
            </div>
            <div className="hero-content text-center text-white">
                <h2 className="text-5xl font-semibold mb-4">{isAuthenticated ? 'Bienvenido de nuevo!' : 'Manicure a Domicilio'}</h2>
                <p className="text-xl mb-8">{isAuthenticated ? 'Gracias por ser parte de nuestra comunidad.' : 'Reserva tu servicio con los mejores profesionales cerca de ti'}</p>
                <Link to="/Mapa">
                    <button className="btn-gradient text-white py-3 px-6 rounded-full text-lg">
                        {isAuthenticated ? 'Explorar servicios' : 'Reserva Ahora'}
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
                        Ver clientes
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
                <h3 className="text-3xl font-semibold text-gray-800 mb-6">Lo que dicen nuestros profesionales</h3>
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