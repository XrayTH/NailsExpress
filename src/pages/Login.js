import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase'; // Asegúrate de que esta ruta sea correcta
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Despachar la acción de login con la información del usuario
            dispatch(login({
                uid: user.uid,
                email: user.email,
            }));

            console.log("Inicio de sesión exitoso con:", email);
            // Redirige a la página de inicio después del inicio de sesión
            navigate('/Inicio');
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Error al iniciar sesión. Por favor verifica tus credenciales.");
        }
    };

    const handleBack = () => {
        // Redirige a la página de inicio
        navigate('/');
    };

    const styles = {
        loginPage: {
            fontFamily: "'Poppins', sans-serif",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            background: "url('Nails imagen.jpg') no-repeat center center fixed",
            backgroundSize: "cover",
            position: "relative",
        },
        header: {
            backgroundColor: '#ec4899',
            color: '#fff',
            padding: '1rem',
            textAlign: 'left',
            width: '100%',
            marginBottom: '1rem',
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
        overlay: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.85)",
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
        },
    };

    return (
        <div>
            <header style={styles.header}>
                <h1 style={{ textAlign: 'left' }}>Nails Express</h1>
            </header>

            <div style={styles.loginPage}>
                <div style={styles.overlay}>
                    <div style={styles.formContainer}>
                        <h2 style={styles.formTitle}>Inicio de Sesión</h2>
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

                            <button
                                type="submit"
                                style={styles.btnGradient}
                            >
                                Iniciar Sesión
                            </button>

                            <button
                                type="button"
                                onClick={handleBack}
                                style={styles.btnGradient}
                            >
                                Volver Atrás
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
