import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../utils/firebase'; // Asegúrate de que la ruta sea correcta

const Inicio = () => {
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
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .overlay img {
                width: 100%;
                height: 100%;
                object-fit: cover;
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

    return (
        <div className="bg-gray-100">
            <Navbar />
            <HeroSection isAuthenticated={isAuthenticated} />
            <Testimonials />
            <CallToAction />
        </div>
    );
};

const Navbar = () => {
    return (
        <header className="bg-pink-600 text-white shadow-md">
            <div className="container mx-auto p-4 flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Nails Express</h1>
                <div>
                    <Link to="/Mapa">
                        <button className="bg-white text-purple-500 py-2 px-4 rounded-full hover:bg-gray-200 mr-2">
                            Ver Mapa
                        </button>
                    </Link>
                    <Link to="/Home">
                        <button className="bg-white text-purple-500 py-2 px-4 rounded-full hover:bg-gray-200 mr-2">
                            Salir
                        </button>
                    </Link>
                    <div style={{ fontSize: '1.125rem' }}>Nombre usuario | Cliente</div>
                </div>
            </div>
        </header>
    );
};

const HeroSection = ({ isAuthenticated }) => {
    return (
        <section className="hero-bg">
            <div className="overlay">
            <img src="https://www.cursosypostgrados.com/blog/wp-content/uploads/2024/09/manicura-chicadeazul.webp" alt="foto" />
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

const CallToAction = () => {
    return (
        <section className="bg-pink-100 py-12">
            <div className="container mx-auto text-center">
                <h3 className="text-4xl font-semibold text-gray-800 mb-6">Encuentra a los mejores profesionales cerca de ti</h3>
                <Link to="/mapa">
                    <button className="btn-gradient text-white py-3 px-6 rounded-full text-lg">
                        Ver Profesionales
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default Inicio;
