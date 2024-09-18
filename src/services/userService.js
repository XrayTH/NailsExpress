import { userService } from '../utils/api';

// Consultar todos los usuarios (clientes, profesionales y admins)
export const getAllUsers = async () => {
  try {
    const response = await userService.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching users');
  }
};

// Consultar un usuario por ID
export const getUserById = async (id) => {
  try {
    const response = await userService.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching user by ID');
  }
};

// Consultar un usuario por nombre de usuario
export const getUserByUsuario = async (usuario) => {
  try {
    const response = await userService.get(`/users/usuario/${usuario}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching user by username');
  }
};

// Consultar un usuario por email
export const getUserByEmail = async (email) => {
  try {
    const response = await userService.get(`/users/email/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching user by email');
  }
};



