import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword } from '../utils/firebase';
import { login } from '../features/authSlice';
import { createProfesional } from '../services/profesionalService';
import { createCliente } from '../services/clienteService';
import { createProfile } from '../services/profileService';
import { createPublication } from '../services/publicationService';
import { createReview } from '../services/reviewService';
import { CircularProgress } from '@material-ui/core';

const Registro = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [role, setRole] = useState('cliente');
    const [error, setError] = useState('');
    const backgroundImageUrl = "https://www.cursosypostgrados.com/blog/wp-content/uploads/2024/09/manicura-chicadeazul.webp";

    const handleRegister = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const username = e.target.username.value;
        

        const additionalData = role === 'profesional' ? {
            nombre: e.target.nombre.value,
            nombreLocal: e.target.nombreLocal.value,
            telefono: e.target.telefono.value,
            pais: e.target.pais.value,
            departamento: e.target.departamento.value,
            ciudad: e.target.ciudad.value,
            direccion: e.target.direccion.value,
        } : {};

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let latLng = {};
            if (role === 'profesional') {
                const query = `${additionalData.direccion}, ${additionalData.ciudad}, ${additionalData.departamento}, ${additionalData.pais}`;
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

                const response = await fetch(url);
                const data = await response.json();

                if (data && data.length > 0) {
                    latLng = {
                        lat: parseFloat(data[0].lat),
                        lng: parseFloat(data[0].lon)
                    };
                } else {
                    alert('No se encontraron coordenadas para la dirección proporcionada.');
                    return;
                }
            }

            if (role === 'profesional') {
                console.log("Datos para el profesional:", {
                    usuario: username,
                    email: user.email,
                    contraseña: password,
                    nombre: additionalData.nombre,
                    nombreLocal: additionalData.nombreLocal,
                    telefono: additionalData.telefono,
                    ubicacion: { lat: latLng.lat, lng: latLng.lng },
                    activo: true,
                });

                await createProfesional({
                    usuario: username,
                    email: user.email,
                    contraseña: password,
                    nombre: additionalData.nombre,
                    nombreLocal: additionalData.nombreLocal,
                    telefono: additionalData.telefono,
                    ubicacion: { lat: latLng.lat, lng: latLng.lng },
                    activo: true,
                });

                await createProfile({
                    profesionalEmail: user.email,
                    titulo: additionalData.nombreLocal,
                    descripción: "Aqui decribe el como trabajas...",
                    dirección: additionalData.direccion,
                    imagen: "",
                    portada: "",
                    servicios: [],
                    ubicación: { lat: latLng.lat, lng: latLng.lng }
                  })

                  await createPublication(user.email)

                  await createReview((user.email))

            } else {
                console.log("Datos para el cliente:", {
                    usuario: username,
                    email: user.email,
                    contraseña: password,
                });

                await createCliente({
                    usuario: username,
                    email: user.email,
                    contraseña: password,
                });
            }

            dispatch(login({
                uid: user.uid,
                email: user.email,
                username,
                role,
                ...additionalData,
            }));

            navigate('/Inicio');
        } catch (error) {
            console.error("Error al registrarse:", error);
            setError("Error al registrarse. Por favor intenta nuevamente.");
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    const styles = {
        registroPage: {
            fontFamily: "'Poppins', sans-serif",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundImage: `url(${backgroundImageUrl})`,
            alignItems: "center",
            backgroundSize: "cover",
        },
        header: {
            backgroundColor: '#DB2777',
            color: '#fff',
            padding: '1rem',
            textAlign: 'left',
            width: '100%',
            marginBottom: '1rem',
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        },
        formContainer: {
            padding: "40px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            background: "rgba(255, 255, 255, 0.85)",
            width: "90%",
            maxWidth: "500px",
            marginTop: "20px",
            overflowY: "auto",
            maxHeight: "80vh",
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
            marginTop: "1rem",
            transition: "background 0.3s ease",
            cursor: 'pointer',
        },
        errorText: {
            color: 'red',
            marginBottom: '1rem',
        },
    };

    return (
        <div style={styles.registroPage}>
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
            <div style={styles.formContainer}>
                <h2 style={styles.formTitle}>Registro</h2>
                {error && <p style={styles.errorText}>{error}</p>}
                
                <label style={styles.formLabel}>Registro como:</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={styles.formInput}
                >
                    <option value="cliente">Cliente</option>
                    <option value="profesional">Profesional</option>
                </select>

                <form onSubmit={handleRegister}>
                    {role === 'profesional' && (
                        <>
                            <label style={styles.formLabel}>Nombre</label>
                            <input type="text" name="nombre" style={styles.formInput} required />
                        </>
                    )}

                    <label style={styles.formLabel}>Nombre de Usuario</label>
                    <input type="text" name="username" style={styles.formInput} required />

                    <label style={styles.formLabel}>Email</label>
                    <input type="email" name="email" style={styles.formInput} required />

                    <label style={styles.formLabel}>Contraseña</label>
                    <input type="password" name="password" style={styles.formInput} required />

                    {role === 'profesional' && (
                        <>
                            <label style={styles.formLabel}>Nombre del Local</label>
                            <input type="text" name="nombreLocal" style={styles.formInput} required />

                            <label style={styles.formLabel}>Teléfono</label>
                            <input type="text" name="telefono" style={styles.formInput} required />

                            <label style={styles.formLabel}>País</label>
                            <input type="text" name="pais" style={styles.formInput} required />

                            <label style={styles.formLabel}>Departamento</label>
                            <input type="text" name="departamento" style={styles.formInput} required />

                            <label style={styles.formLabel}>Ciudad</label>
                            <input type="text" name="ciudad" style={styles.formInput} required />

                            <label style={styles.formLabel}>Dirección</label>
                            <input type="text" name="direccion" style={styles.formInput} required />
                        </>
                    )}

                    <button type="submit" style={styles.btnGradient}>Registrar</button>
                </form>
                <button onClick={handleBack} style={styles.btnGradient}>Volver Atrás</button>
            </div>
        </div>
    );
};

export default Registro;
