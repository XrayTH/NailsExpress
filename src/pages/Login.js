/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../utils/firebase'; // Verifica que la ruta sea correcta
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/authSlice';
import { setUser, selectUserType, setStatus, setError } from '../features/userSlice';
import { CircularProgress } from '@material-ui/core';
import { getClienteByEmail } from '../services/clienteService';
import { getProfesionalByEmail } from '../services/profesionalService';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const backgroundImageUrl = "https://www.cursosypostgrados.com/blog/wp-content/uploads/2024/09/manicura-chicadeazul.webp";

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
    
        setLoading(true); // Activar el indicador de carga
    
        try {
            let userTypeDetected = null;
    
            // Verificar si el usuario es un cliente
            try {
                const clienteData = await getClienteByEmail(email);
                if (clienteData) {
                    userTypeDetected = 'cliente';
                    dispatch(setUser({
                        user: { email, role: 'cliente' },
                        userType: 'cliente',
                    }));
                } else {
                    throw new Error('Cliente no encontrado');
                }
            } catch {
                // Si no es cliente, intentar verificar si es un profesional
                try {
                    const profesionalData = await getProfesionalByEmail(email);
                    if (profesionalData) {
                        userTypeDetected = 'profesional';
                        dispatch(setUser({
                            user: { email, role: 'profesional' },
                            userType: 'profesional',
                        }));
                    } else {
                        throw new Error('Profesional no encontrado');
                    }
                } catch (error) {
                    console.error("Error al detectar el tipo de usuario:", error);
                    alert("No se pudo identificar el tipo de usuario.");
                    setLoading(false);
                    return;
                }
            }
    
            // Realizar el inicio de sesión con Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Despachar la acción de login con la información del usuario
            dispatch(login({
                uid: user.uid,
                email: user.email,
            }));
    
            // Esperar la actualización del estado de userType y navegar después
            setTimeout(() => {
                console.log("userTypeDetected after delay:", userTypeDetected);  // Verifica si userTypeDetected es correcto
                if (userTypeDetected === 'cliente') {
                    navigate('/Inicio');
                } else if (userTypeDetected === 'profesional') {
                    navigate('/InicioPro');
                }
            }, 100);  // Puedes ajustar el tiempo si es necesario
    
            console.log("Inicio de sesión exitoso con:", email);
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Error al iniciar sesión. Por favor verifica tus credenciales.");
        } finally {
            setLoading(false); // Desactivar el indicador de carga
        }
    };    

    const handleBack = () => {
        navigate('/'); // Redirigir a la página de inicio
    };

    const styles = {
        loginPage: {
            fontFamily: "'Poppins', sans-serif",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            position: "relative",
        },
        header: {
            backgroundColor: '#DB2777',
            color: '#fff',
            padding: '1rem',
            textAlign: 'left',
            width: '97,8%',
            //marginBottom: '1rem',
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
        overlay: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            //background: "#a959f5",
            
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        formContainer: {
            padding: "40px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginTop: "-200px",
            maxWidth: "500px",
            width: "100%",
            background: "rgba(255, 255, 255, 0.85)",
        },
        formTitle: {
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
        },
        formLabel: {
            display: "block",
            textAlign: "left",
            fontWeight: 600,
            marginBottom: "0.25rem",
        },
        formInput: {
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
        },
        btnGradient: {
            background: "linear-gradient(90deg, rgba(127, 27, 221, 1) 0%, rgba(255, 105, 180, 1) 100%)",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            marginTop: "1.5rem",
            transition: "background 0.3s ease",
            margin: '10px',
            cursor: 'pointer',
        },
    };

    return (
        <div>
            <header style={styles.header}>
            <Link to="/">
            <img 
                    src="https://i.imgur.com/QJTUutm.png" 
                    alt="Logo Nails Express" 
                    className="object-contain" 
    style={{ height: '50px', width: '200px' }}
                />
                </Link>
            </header>

            <div style={styles.loginPage}>
                <div style={styles.overlay}>
                    <div style={styles.formContainer}>
                        <h2 style={styles.formTitle}>Inicio de sesión</h2>
                        <form onSubmit={handleLogin}>
                            <label htmlFor="email" style={styles.formLabel}>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                style={styles.formInput}
                                placeholder="correo@ejemplo.com"
                                required
                            />

                            <label htmlFor="password" style={styles.formLabel}>Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                style={styles.formInput}
                                placeholder="Ingresa tu contraseña"
                                required
                            />

                            {loading ? (
                                <CircularProgress
                                style={{color: '#ec4899',}}
                                />
                            ) : (
                                <>
                                 <button
                                    type="submit"
                                    style={styles.btnGradient}
                                >
                                    Iniciar sesión
                                </button>
                                
                                <button
                                type="button"
                                onClick={handleBack}
                                style={styles.btnGradient}
                            >
                                Volver atrás
                            </button> 
                            </>
                            )}

                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
