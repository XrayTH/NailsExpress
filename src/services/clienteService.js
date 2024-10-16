import { userService } from '../utils/api'; // Asegúrate de ajustar la ruta según tu estructura de archivos

// Consultar todos los clientes
export const getAllClientes = async () => {
  try {
    const response = await userService.get('/clientes');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching clients');
  }
};

// Consultar un cliente por ID
export const getClienteById = async (id) => {
  try {
    const response = await userService.get(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching client by ID');
  }
};

// Consultar un cliente por email
export const getClienteByEmail = async (email) => {
  try {
    const response = await userService.get(`/clientes/email/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching client by email');
  }
};

// Consultar un cliente por nombre de usuario
export const getClienteByUsername = async (username) => {
  try {
    const response = await userService.get(`/clientes/username/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching client by username');
  }
};

// Crear un nuevo cliente
export const createCliente = async (clienteData) => {
  try {
    const response = await userService.post('/clientes', clienteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating client');
  }
};

// Modificar un cliente existente
export const updateCliente = async (id, clienteData) => {
  try {
    const response = await userService.put(`/clientes/${id}`, clienteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating client');
  }
};

// Borrar un cliente
export const deleteCliente = async (id) => {
  try {
    await userService.delete(`/clientes/${id}`);
    return { message: 'Client deleted successfully' };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting client');
  }
};

export const toggleClienteActiveStatus = async (email) => {
  try {
    const response = await userService.patch(`/clientes/${email}/toggle-active`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error toggling client active status');
  }
};