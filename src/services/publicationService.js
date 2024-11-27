import { profileService } from '../utils/api'; // Ajusta la ruta según tu estructura de archivos

// Obtener todas las publicaciones
export const getAllPublications = async () => {
  try {
    const response = await profileService.get('/publicaciones');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching publications');
  }
};

// Obtener publicaciones por correo
export const getPublicationsByEmail = async (email) => {
  try {
    const response = await profileService.get(`/publicaciones/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching publications by email');
  }
};

// Crear nuevas publicaciones
export const createPublication = async (email) => {
  try {
    const response = await profileService.post(`/publicaciones/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating publication');
  }
};

// Borrar todas las publicaciones por correo
export const deletePublications = async (email) => {
  try {
    const response = await profileService.delete(`/publicaciones/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting publications');
  }
};

// Añadir una nueva publicación
export const addPublication = async (email, publicationData) => {
  try {
    const response = await profileService.post(`/publicaciones/${email}/publicaciones`, publicationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error adding publication');
  }
};

// Borrar una publicación
export const removePublication = async (email, index) => {
  try {
    const response = await profileService.delete(`/publicaciones/${email}/remove/${index}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error removing publication');
  }
};

// Editar una publicación
export const updatePublication = async (email, index, publicationData) => {
  try {
    const response = await profileService.put(`/publicaciones/${email}/edit/${index}`, publicationData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating publication');
  }
};

// Cambiar estado activo
export const togglePublicationActiveStatus = async (email) => {
  try {
    const response = await profileService.patch(`/publicaciones/${email}/toggle-active-status`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error toggling publication active status');
  }
};

