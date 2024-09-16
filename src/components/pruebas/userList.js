import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/userService'; // Asegúrate de ajustar la ruta según tu estructura de archivos
import { makeStyles, Typography, Container, Paper, CircularProgress, List, ListItem, ListItemText } from '@material-ui/core';

const UserList = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className={classes.loading}><CircularProgress /></div>;
  if (error) return <p className={classes.error}>Error: {error}</p>;

  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Lista de Usuarios
      </Typography>
      <Paper className={classes.paper}>
        {users.length === 0 ? (
          <Typography variant="body1" align="center">
            No hay usuarios disponibles.
          </Typography>
        ) : (
          <List>
            {users.map((user) => (
              <ListItem key={user._id} className={classes.listItem}>
                <ListItemText
                  primary={<Typography variant="h6">Nombre de Usuario: {user.usuario}</Typography>}
                  secondary={
                    <>
                      <Typography variant="body2"><strong>ID:</strong> {user._id}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {user.email}</Typography>
                      <Typography variant="body2"><strong>Tipo:</strong> {user.tipo || 'Desconocido'}</Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
    container: {
      padding: theme.spacing(4),
      maxWidth: '800px',
      margin: 'auto',
    },
    paper: {
      padding: theme.spacing(3),
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[3],
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    error: {
      color: theme.palette.error.main,
      textAlign: 'center',
    },
    listItem: {
      marginBottom: theme.spacing(2),
    },
  }));

export default UserList;

