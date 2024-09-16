import axios from 'axios';

// Conexión al backend local
const api = axios.create({
  baseURL: ""+process.env.REACT_APP_USERS_URL,
  timeout: 1000,
});

export { api };

