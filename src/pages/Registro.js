import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword } from '../utils/firebase';
import { login } from '../features/authSlice';
import { createProfesional } from '../services/profesionalService';

const Registro = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [role, setRole] = useState('cliente');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const username = e.target.username.value;
        const nombre = e.target.nombre?.value; // Solo para profesional
        const telefono = e.target.telefono?.value;

        const additionalData = role === 'profesional' ? {
            nombreLocal: e.target.nombreLocal.value,
            telefono: e.target.telefono.value,
            pais: e.target.pais.value,
            departamento: e.target.departamento.value,
            ciudad: e.target.ciudad.value,
            direccion: e.target.direccion.value,
        } : {
            telefono
        };

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
                    nombre, // Se agrega el nombre
                    nombreLocal: additionalData.nombreLocal,
                    telefono: additionalData.telefono,
                    ubicacion: { lat: latLng.lat, lng: latLng.lng },
                    activo: true,
                });

                await createProfesional({
                    usuario: username,
                    email: user.email,
                    contraseña: password,
                    nombre, // Se agrega el nombre
                    nombreLocal: additionalData.nombreLocal,
                    telefono: additionalData.telefono,
                    ubicacion: { lat: latLng.lat, lng: latLng.lng },
                    activo: true,
                });
            }

            dispatch(login({
                uid: user.uid,
                email: user.email,
                username,
                role,
                nombre, // Se agrega el nombre
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
            justifyContent: "center",
            alignItems: "center",
            background: "url('Nails imagen.jpg') no-repeat center center fixed",
            backgroundSize: "cover",
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
        },
        errorText: {
            color: 'red',
            marginBottom: '1rem',
        },
    };

    return (
        <div style={styles.registroPage}>
            <header style={styles.header}>
                <h1>Nails Express</h1>
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
