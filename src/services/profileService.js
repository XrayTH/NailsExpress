import { profileService } from '../utils/api'; // Ajusta la ruta según tu estructura de archivos

// Consultar todos los perfiles
export const getAllProfiles = async () => {
  try {
    const response = await profileService.get('/perfiles');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching profiles');
  }
};

// Crear un nuevo perfil
export const createProfile = async (profileData) => {
  try {
    const response = await profileService.post('/perfiles', profileData);
    return response.data;
  } catch (error) {
    // Extraer información más específica del error
    if (error.response) {
      // El servidor respondió con un estado distinto a 2xx
      const { status, data } = error.response;
      throw new Error(`Error ${status}: ${data.message || 'Error al crear el perfil'}`);
    } else if (error.request) {
      // La solicitud fue enviada pero no hubo respuesta
      throw new Error('Error de red: No se recibió respuesta del servidor');
    } else {
      // Otro error durante la configuración de la solicitud
      throw new Error(`Error desconocido: ${error.message}`);
    }
  }
};

// Consultar un perfil por email
export const getProfileByEmail = async (email) => {
  try {
    const response = await profileService.get(`/perfiles/email/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching profile by email');
  }
};

// Actualizar un perfil existente
export const updateProfile = async (email, profileData) => {
  try {
    const response = await profileService.put(`/perfiles/${email}`, profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating profile');
  }
};

// Borrar un perfil
export const deleteProfile = async (email) => {
  try {
    await profileService.delete(`/perfiles/${email}`);
    return { message: 'Profile deleted successfully' };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting profile');
  }
};

// Cambiar estado de activo
export const toggleProfileActiveStatus = async (email) => {
  try {
    const response = await profileService.patch(`/perfiles/${email}/toggle-active`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error toggling profile active status');
  }
};
