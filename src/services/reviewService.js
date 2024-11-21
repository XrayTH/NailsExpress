import { profileService } from '../utils/api'; // Ajusta la ruta según tu estructura de archivos

// Crear nuevas reseñas
export const createReview = async (email) => {
  try {
    const response = await profileService.post(`/reviews/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating review');
  }
};

// Añadir una nueva reseña
export const addReview = async (email, reviewData) => {
  try {
    const response = await profileService.post(`/reviews/${email}/add`, reviewData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error adding review');
  }
};

// Borrar una reseña
export const deleteReview = async (email, index) => {
  try {
    const response = await profileService.delete(`/reviews/${email}/delete/${index}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting review');
  }
};

// Calcular el promedio de calificaciones
export const getAverageRating = async (email) => {
  try {
    const response = await profileService.get(`/reviews/${email}/average-rating`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error getting average rating');
  }
};

// Cambiar estado activo
export const toggleReviewActiveStatus = async (email) => {
  try {
    const response = await profileService.patch(`/reviews/${email}/toggle-active-status`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error toggling review active status');
  }
};
