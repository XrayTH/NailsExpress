import React, { useEffect, useState } from 'react';
import {  useLocation, Link } from 'react-router-dom'; // Importar Link
//import logo from './assets/logotipo.png';

// Componente principal
const HomePage = () => {
    useEffect(() => {
        // Configurar meta etiquetas y enlaces al cargar el componente
        document.title = 'PAGINA PRINCIPAL';

        // Crear y añadir meta tags
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
            // Cleanup function to remove the styles when the component unmounts
            document.head.removeChild(metaCharset);
            document.head.removeChild(metaViewport);
            document.head.removeChild(tailwindLink);
            document.head.removeChild(poppinsLink);
            document.head.removeChild(styles);
        };
    }, []);

    return (
        <div className="bg-gray-100">
            <Navbar />
            <HeroSection />
            <CallToAction />
            <Testimonials />
        </div>
    );
};

// Componente de la barra de navegación
const Navbar = () => {
    const location = useLocation(); // Obtener la ruta actual

    const handleLogoClick = () => {
        // Si ya estamos en la página principal, recarga la página
        if (location.pathname === '/') {
            window.location.reload();
        }
    };

    return (
        <header className="bg-pink-600 text-white shadow-md">
            <div className="container mx-auto p-4 flex justify-between items-center">
                 {/* Imagen en lugar del título de texto */}
                 <Link to="/" onClick={handleLogoClick}>
                 <img 
                    src="https://i.imgur.com/QJTUutm.png" 
                    alt="Logo Nails Express" 
                    className="object-contain" 
    style={{ height: '50px', width: '200px' }}
    
                />
                </Link>
                <div>
                    <Link to="/login">
                        <button className="bg-white text-purple-500 py-2 px-4 rounded-full hover:bg-gray-200 mr-2">
                            Iniciar sesión
                        </button>
                    </Link>
                    <Link to="/registro">
                        <button className="bg-white text-purple-500 py-2 px-4 rounded-full hover:bg-gray-200">
                            Registrarse
                        </button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

// Componente de la sección hero
const HeroSection = () => {
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
                <h2 className="text-5xl font-semibold mb-4">Manicure a domicilio</h2>
                <p className="text-xl mb-8">Reserva tu servicio con los mejores profesionales cerca de ti</p>
                <Link to="/login">
                    <button className="btn-gradient text-white py-3 px-6 rounded-full text-lg">
                        Inicia sesión para reservar
                    </button>
                </Link>
            </div>
        </section>
    );
};

// Componente de llamada a la acción
const CallToAction = () => {
    return (
        <section className="bg-pink-100 py-12">
            <div className="container mx-auto text-center">
                <h3 className="text-4xl font-semibold text-gray-800 mb-6">Encuentra a los mejores profesionales cerca de ti</h3>
                <Link to="/mapa">
                    <button className="btn-gradient text-white py-3 px-6 rounded-full text-lg">
                        Ver profesionales
                    </button>
                </Link>
            </div>
        </section>
    );
};

// Componente de testimonios
const Testimonials = () => {
    const testimonios = [
        {
            texto: 'El servicio fue excelente, la profesional llegó a tiempo y el resultado fue espectacular. Recomendado 100%.',
            autor: 'Andrea P.'
        },
        {
            texto: 'Nunca pensé que una manicura a domicilio sería tan conveniente y de tan alta calidad. Definitivamente volveré a reservar.',
            autor: 'Luisa G.'
        },
        {
            texto: 'Fácil de usar, profesionales amables y resultados increíbles. ¡Lo mejor que he probado en servicios de belleza!',
            autor: 'Carmen T.'
        }
    ];

    return (
        <section className="testimonios-bg py-12">
            <div className="container mx-auto text-center">
                <h3 className="text-3xl font-semibold text-gray-800 mb-6">Lo que dicen nuestros clientes</h3>
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


export default HomePage;