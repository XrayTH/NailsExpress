import { userService } from '../utils/api'; // Ajusta la ruta según la estructura de tu proyecto

// Consultar todos los profesionales
export const getAllProfesionales = async () => {
  try {
    const response = await userService.get('/profesionales');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching professionals');
  }
};

// Consultar un profesional por ID
export const getProfesionalById = async (id) => {
  try {
    const response = await userService.get(`/profesionales/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching professional by ID');
  }
};

// Consultar un profesional por email
export const getProfesionalByEmail = async (email) => {
  try {
    const response = await userService.get(`/profesionales/email/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching professional by email');
  }
};

// Consultar un profesional por nombre de usuario
export const getProfesionalByUsername = async (username) => {
  try {
    const response = await userService.get(`/profesionales/username/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching professional by username');
  }
};

// Crear un nuevo profesional
export const createProfesional = async (profesionalData) => {
  try {
    const response = await userService.post('/profesionales', profesionalData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating professional');
  }
};

// Actualizar un profesional existente
export const updateProfesional = async (id, profesionalData) => {
  try {
    const response = await userService.put(`/profesionales/${id}`, profesionalData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating professional');
  }
};

// Eliminar un profesional
export const deleteProfesional = async (id) => {
  try {
    await userService.delete(`/profesionales/${id}`);
    return { message: 'Professional deleted successfully' };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting professional');
  }
};
