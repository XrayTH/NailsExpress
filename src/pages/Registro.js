import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword } from '../utils/firebase';
import { login } from '../features/authSlice';
import { createCliente } from '../services/clienteService'; // Importa la función correcta
import { createProfesional } from '../services/profesionalService'; // Importa la función correcta

const Registro = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [role, setRole] = useState('cliente'); // 'cliente' o 'profesional'
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const username = e.target.username.value;
        const telefono = e.target.telefono?.value; // Obtener teléfono si es cliente

        // Recolecta información adicional dependiendo del rol
        const additionalData = role === 'profesional' ? {
            nombreCompleto: e.target.nombreCompleto.value,
            nombreLocal: e.target.nombreLocal.value,
            telefono: e.target.telefono.value,
            pais: e.target.pais.value,
            departamento: e.target.departamento.value,
        } : {
            telefono // Solo se agrega si es cliente
        };

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Crear el cliente o profesional en la base de datos
            if (role === 'cliente') {
                await createCliente({
                    usuario: username, // Cambiado a 'usuario'
                    email: user.email,
                    contraseña: password, // Cambiado a 'contraseña'
                    telefono: telefono,
                });
            } else {
                await createProfesional({
                    usuario: username, // Cambiado a 'usuario'
                    email: user.email,
                    contraseña: password, // Cambiado a 'contraseña'
                    telefono: e.target.telefono.value,
                    nombreCompleto: e.target.nombreCompleto.value,
                    nombreLocal: e.target.nombreLocal.value,
                    pais: e.target.pais.value,
                    departamento: e.target.departamento.value,
                });
            }

            // Despachar la acción de login con la información del usuario
            dispatch(login({
                uid: user.uid,
                email: user.email,
                username, // Incluye el nombre de usuario
                role, // Incluye el rol del usuario
                ...additionalData, // Incluye datos adicionales si es profesional
            }));

            // Redirigir a la página de inicio
            navigate('/Inicio');
        } catch (error) {
            console.error("Error al registrarse:", error);
            setError("Error al registrarse. Por favor intenta nuevamente.");
        }
    };

    const handleBack = () => {
        navigate('/'); // Redirigir a la página de inicio
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
                
                {/* Selector de rol */}
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
                    <label style={styles.formLabel}>Nombre de Usuario</label>
                    <input type="text" name="username" style={styles.formInput} required />

                    <label style={styles.formLabel}>Email</label>
                    <input type="email" name="email" style={styles.formInput} required />

                    <label style={styles.formLabel}>Contraseña</label>
                    <input type="password" name="password" style={styles.formInput} required />

                    {role === 'cliente' && (
                        <>
                            <label style={styles.formLabel}>Teléfono</label>
                            <input type="text" name="telefono" style={styles.formInput} required />
                        </>
                    )}

                    {role === 'profesional' && (
                        <>
                            <label style={styles.formLabel}>Nombre Completo</label>
                            <input type="text" name="nombreCompleto" style={styles.formInput} required />

                            <label style={styles.formLabel}>Nombre del Local</label>
                            <input type="text" name="nombreLocal" style={styles.formInput} required />

                            <label style={styles.formLabel}>Teléfono</label>
                            <input type="text" name="telefono" style={styles.formInput} required />

                            <label style={styles.formLabel}>País</label>
                            <input type="text" name="pais" style={styles.formInput} required />

                            <label style={styles.formLabel}>Departamento</label>
                            <input type="text" name="departamento" style={styles.formInput} required />
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
