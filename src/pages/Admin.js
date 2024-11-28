import React, { useEffect, useState, useRef, useMemo } from 'react';
import * as profesionalService from '../services/profesionalService';
import * as clienteService from '../services/clienteService';
import * as adminService from '../services/adminService';
import { auth, createUserWithEmailAndPassword } from '../utils/firebase';
import { logout } from '../features/authSlice';
import { logoutUser } from '../features/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminProfile = () => {
    const [users, setUsers] = useState([]); // Lista de usuarios combinados
    const [searchTerm, setSearchTerm] = useState(''); // Barra de búsqueda
    const [filter, setFilter] = useState('Todos'); // Filtro por tipo de usuario
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal para crear admin
    const [showStats, setShowStats] = useState(false); // Nuevo estado para estadísticas
    const canvasRef = useRef(null); // Referencia para el canvas
    const canvasRefBar = useRef(null); // Referencia para el gráfico de barras
    const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' }); // Datos del nuevo admin
    const dispatch = useDispatch();  // Hook para despachar acciones
    const navigate = useNavigate();  // Hook para la navegación

    // Cargar los datos desde los servicios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [clients, professionals, admins] = await Promise.all([
                    clienteService.getAllClientes(),
                    profesionalService.getAllProfesionales(),
                    adminService.getAllAdmins(),
                ]);
        
                console.log('Clientes:', clients); // Verificar datos de clientes
                console.log('Profesionales:', professionals); // Verificar datos de profesionales
                console.log('Admins:', admins); // Verificar datos de administradores
    
                const combinedUsers = [
                    ...clients.map(client => ({ id: client._id, username: client.usuario, email: client.email, type: 'Cliente', createdAt: client.createdAt })),
                    ...professionals.map(profesional => ({ id: profesional._id, username: profesional.usuario, email: profesional.email, type: 'Profesional', createdAt: profesional.createdAt })),
                    ...admins.map(admin => ({ id: admin._id, username: admin.usuario, email: admin.email, type: 'Administrador', createdAt: admin.createdAt })),
                ];
                
    
                console.log('Usuarios combinados:', combinedUsers); // Verificar los usuarios combinados
                setUsers(combinedUsers);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        };
    
        fetchUsers();
    }, []);

    // Filtrar usuarios basados en búsqueda y filtro
    const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' || user.type === filter;
    return matchesSearch && matchesFilter;
    });

    // Eliminar un usuario
    const deleteUser = async (id, type) => {
        try {
            if (type === 'Cliente') {
                await clienteService.deleteCliente(id);
            } else if (type === 'Profesional') {
                await profesionalService.deleteProfesional(id);
            } else if (type === 'Administrador') {
                await adminService.deleteAdmin(id);
            }

            // Actualiza la lista después de eliminar
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };

    // Abrir y cerrar modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Manejar el formulario de nuevo administrador
    const handleNewAdminChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin(prevState => ({ ...prevState, [name]: value }));
    };

    const handleNewAdminSubmit = async (e) => {
        e.preventDefault();

        const formattedAdmin = {
            usuario: newAdmin.username, // Cambia el nombre de la propiedad
            contraseña: newAdmin.password,
            email: newAdmin.email,
        };

        try {
            const createdAdmin = await adminService.createAdmin(formattedAdmin);
            await createUserWithEmailAndPassword(auth, newAdmin.email, newAdmin.password);
            closeModal();
            setUsers(prevUsers => [...prevUsers, { 
                id: createdAdmin._id, 
                username: createdAdmin.usuario, 
                email: createdAdmin.email, 
                type: 'Administrador' 
            }]);
            setNewAdmin({ username: '', email: '', password: '' });
        } catch (error) {
            console.error('Error al crear administrador:', error);
            alert('Error al crear el administrador. Por favor, inténtalo de nuevo.');
        }
    };
    // Función para cerrar sesión
    const handleLogout = () => {
        // Despachar las acciones para limpiar el estado en ambos slices
        dispatch(logout());  // Limpiar el estado de autenticación
        dispatch(logoutUser());  // Limpiar el estado del usuario
        
        // Redirigir a la página de inicio (o donde prefieras)
        navigate("/");  
    };

    const getLast30DaysData = useMemo(() => {
        const now = new Date();
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            return date.toISOString().slice(0, 10); // Formato YYYY-MM-DD
        }).reverse();

        const counts = last30Days.map(date => ({
            date,
            count: users.filter(user => user.type === 'Cliente' && user.createdAt?.startsWith(date)).length,
        }));

        return counts;
    }, [users]);

    useEffect(() => {
        if (showStats) {
            drawChart();
            drawBarChart();
        }
    }, [showStats, getLast30DaysData]);

    
    // Dibuja el gráfico de pastel
    const drawChart = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const counts = users.reduce((acc, user) => {
            acc[user.type] = (acc[user.type] || 0) + 1;
            return acc;
        }, {});

        const labels = Object.keys(counts);
        const values = Object.values(counts);
        const total = values.reduce((acc, value) => acc + value, 0);
        let startAngle = 0;

        labels.forEach((label, index) => {
            const sliceAngle = (values[index] / total) * (2 * Math.PI);
            const color = getColorForIndex(index);
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, 100, startAngle, startAngle + sliceAngle);
            ctx.fill();

            const textAngle = startAngle + sliceAngle / 2;
            const x = canvas.width / 2 + Math.cos(textAngle) * 120;
            const y = canvas.height / 2 + Math.sin(textAngle) * 120;

            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.fillText(label, x, y);
            ctx.fillText(`${values[index]} (${((values[index] / total) * 100).toFixed(1)}%)`, x, y + 20);

            startAngle += sliceAngle;
        });
    };

    // Dibuja el gráfico de barras
    const drawBarChart = () => {
        const canvas = canvasRefBar.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const data = getLast30DaysData;
        const maxCount = Math.max(...data.map(item => item.count), 1);

        const chartWidth = canvas.width - 50;
        const chartHeight = canvas.height - 100;
        const barWidth = chartWidth / data.length;

        ctx.font = '8px Arial';
        ctx.textAlign = 'right';

        data.forEach((item, index) => {
            const barHeight = (item.count / maxCount) * chartHeight;

            ctx.fillStyle = '#7f1bdd';
            ctx.fillRect(
                25 + index * barWidth,
                canvas.height - barHeight - 25,
                barWidth - 5,
                barHeight
            );

            ctx.fillStyle = '#000';
            ctx.fillText(item.count, 25 + index * barWidth + barWidth / 2, canvas.height - barHeight - 30);

            const date = new Date(item.date);
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;

            ctx.save();
            ctx.translate(25 + index * barWidth + barWidth / 2, canvas.height - 5);
            ctx.rotate(-Math.PI / -4);
            ctx.fillText(formattedDate, 0, 0);
            ctx.restore();
        });
    };

    
    
    const getColorForIndex = (index) => {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33'];
        return colors[index % colors.length];
    };
        
    const userCounts = users.reduce((acc, user) => {
        acc[user.type] = (acc[user.type] || 0) + 1;
        return acc;
    }, {});    

    // Descargar PDF con estadísticas
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Estadísticas de Usuarios registrados en los ultimos 30 días.', 10, 10);
        // Obtener los usuarios por tipo
        const userCounts = users.reduce((acc, user) => {
            acc[user.type] = (acc[user.type] || 0) + 1;
            return acc;
        }, {});

        // Añadir la información de la cantidad de usuarios por tipo al PDF
        doc.text('Cantidad de usuarios por tipo:', 10, 20);
        let yPosition = 30;
        for (let [type, count] of Object.entries(userCounts)) {
            doc.text(`${type}: ${count} usuarios`, 10, yPosition);
            yPosition += 10;
        }

        // Ahora agregamos la tabla de estadísticas de últimos 30 días
        const data = getLast30DaysData.map(item => [item.date, item.count]);
        doc.text('Estadísticas de Últimos 30 Días:', 10, yPosition);
        yPosition += 10;  // Dejar espacio antes de la tabla

        doc.autoTable({
            startY: yPosition,  // Establecer la posición inicial de la tabla
            head: [['Fecha', 'Nuevos Clientes']],
            body: data,
        });
        doc.save('Estadisticas_Usuarios.pdf');
    };

    const styles = {

        body: {
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: 'rgba(127, 27, 221, 0.1)', // Color de fondo
            margin: 0,
            padding: 0,
            minHeight: '100vh', // Asegura que el fondo cubra toda la pantalla
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
        header: {
            backgroundColor: '#ec4899',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
        },
        searchBar: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
        },
        userList: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        userItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            borderBottom: '1px solid #ccc',
        },
        userInfo: {
            display: 'flex',
            flexDirection: 'column',
        },
        modal: {
            display: isModalOpen ? 'block' : 'none',
            position: 'fixed',
            zIndex: 1,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: 'white',
            margin: '15% auto',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '400px',
        },
        closeBtn: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            fontSize: '24px',
        },
        input: {
            width: '80%',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '8px',
            border: '1px solid #ccc',
        },
        formButton: {
            background: 'linear-gradient(90deg, rgba(127, 27, 221, 1) 0%, rgba(255, 105, 180, 1) 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            border: 'none',
            cursor: 'pointer',
        }
        
    };

    return (
        <div style={styles.body}>
            {/* Header */}
            <header style={styles.header}>
                <img
                    src="https://i.imgur.com/QJTUutm.png"
                    alt="Nails Express Logo"
                    style={{ height: '50px', objectFit: 'contain' }}
                />
               {/* Botón de cerrar sesión */}
    <button onClick={handleLogout} style={styles.btnGradient}>
        Cerrar sesión
    </button> 
            </header>

            {/* Contenedor de búsqueda y filtro */}
            <section style={styles.container}>
                <div style={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Buscar usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={openModal} style={styles.btnGradient}>
                        Crear Usuario
                    </button>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={styles.input}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Cliente">Clientes</option>
                        <option value="Profesional">Profesionales</option>
                        <option value="Administrador">Administradores</option>
                    </select>
                </div>

                {/* Modal para nuevo administrador */}
                {isModalOpen && (
                    <div style={styles.modal} onClick={closeModal}>
                        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <span style={styles.closeBtn} onClick={closeModal}>&times;</span>
                            <h2>Crear Nuevo Usuario</h2>
                            <form onSubmit={handleNewAdminSubmit}>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Nombre de usuario"
                                    required
                                    value={newAdmin.username}
                                    onChange={handleNewAdminChange}
                                    style={styles.input}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    required
                                    value={newAdmin.email}
                                    onChange={handleNewAdminChange}
                                    style={styles.input}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    required
                                    value={newAdmin.password}
                                    onChange={handleNewAdminChange}
                                    style={styles.input}
                                />
                                <button type="submit" style={styles.formButton}>Crear Admin</button>
                              

                            </form>
                        </div>
                    </div>
                )}

                {/* Lista de usuarios */}
                <div style={styles.userList}>
                    {filteredUsers.map(user => (
                        <div key={user.id} style={styles.userItem}>
                            <div style={styles.userInfo}>
                                <span>{user.username}</span>
                                <span style={{ color: '#888' }}>{user.type}</span>
                            </div>
                            <button onClick={() => {}} style={styles.btnGradient}>
                                Actualizar
                            </button>
                            <button onClick={() => deleteUser(user.id, user.type)} style={styles.btnGradient}>
                                Borrar
                            </button>
                        </div>
                    ))}
                </div>
            </section>
                       {/* Botón para mostrar estadísticas */}
                       <button
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: 'linear-gradient(90deg, #7f1bdd, #ff69b4)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    marginLeft: '600px',
                }}
                onClick={() => setShowStats(!showStats)}
            >
                {showStats ? 'Ocultar Estadísticas' : 'Ver Estadísticas'}
            </button>

            {showStats && (
    <>
        <div>
            {/* Botón para mostrar estadísticas */}
            <button
                onClick={downloadPDF}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: 'linear-gradient(90deg, #7f1bdd, #ff69b4)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    marginLeft: '500px',
                    width: '157px',
                    marginBottom: '20px',
                }}
            >
                Descargar PDF
            </button>
            {/* Botón para enviar correo */}
            <button
                onClick={() => {
                    setTimeout(() => alert('Correo Enviado'), 3000);
                }}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: 'linear-gradient(90deg, #7f1bdd, #ff69b4)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                    width: '157px',
                    marginBottom: '20px',
                }}
            >
                Enviar Correo
            </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div>
                <h3 style={{ fontSize: '20px', color: '#060202', fontWeight: 'bold' }}>
                    Total de Usuarios
                </h3>
                <canvas
                    ref={canvasRef}
                    width="500"
                    height="300"
                    style={{
                        display: 'block',
                        margin: '20px auto',
                        border: '1px solid #ccc',
                    }}
                ></canvas>
            </div>
            <div>
                <h3 style={{ fontSize: '20px', color: '#060202', fontWeight: 'bold' }}>
                    Usuarios Registrados en los Últimos 30 Días.
                </h3>
                <canvas
                    ref={canvasRefBar}
                    width="600"
                    height="300"
                    style={{
                        display: 'block',
                        margin: '20px auto',
                        border: '1px solid #ccc',
                    }}
                ></canvas>
            </div>
        </div>
    </>
)}

    </div>
            );
};

export default AdminProfile;