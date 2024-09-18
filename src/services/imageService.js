import { imageService } from '../utils/api';

// Subir una imagen
export const uploadImage = async (formData) => {
  try {
    const response = await imageService.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error uploading image');
  }
};

// Obtener una imagen por nombre
export const getImageByName = async (filename) => {
  try {
    const response = await imageService.get(`/image/${filename}`, {
      responseType: 'blob', // Importante para manejar imágenes como archivos binarios
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching image');
  }
};
