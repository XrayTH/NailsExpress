//Zona de administracion
import React, { useState } from 'react';

const AdminProfile = () => {
    // Estado para la lista de usuarios
    const [users, setUsers] = useState([
        { id: 1, name: 'Juan Pérez', type: 'Cliente' },
        { id: 2, name: 'María Gómez', type: 'Profesional' },
        { id: 3, name: 'Pedro López', type: 'Cliente' },
    ]);

    // Estado para la barra de búsqueda y el filtro
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('Todos');

    // Función para manejar la búsqueda
    const handleSearch = () => {
        // Aquí podrías filtrar los usuarios dependiendo del término de búsqueda
    };

    // Función para eliminar un usuario
    const deleteUser = (id) => {
        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'Todos') return true;
        return user.type === filter;
    });

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
    };

    return (
        <div style={styles.body}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: '600' }}>Nails Express - Admin</h1>
                <div style={{ fontSize: '1.125rem' }}>Administrador</div>
            </header>

            {/* Contenedor de búsqueda y filtro */}
            <section style={styles.container}>
                <div style={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Buscar usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', width: '300px' }}
                    />
                    <button onClick={handleSearch} style={styles.btnGradient}>Buscar</button>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Cliente">Clientes</option>
                        <option value="Profesional">Profesionales</option>
                    </select>
                </div>

                {/* Lista de usuarios */}
                <div style={styles.userList}>
                    {filteredUsers.map(user => (
                        <div key={user.id} style={styles.userItem}>
                            <div style={styles.userInfo}>
                                <span>{user.name}</span>
                                <span style={{ color: '#888' }}>{user.type}</span>
                            </div>
                            <button onClick={() => deleteUser(user.id)} style={styles.btnGradient}>Borrar</button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminProfile;