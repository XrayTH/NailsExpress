import { profileService } from '../utils/api'; // Ajusta la ruta según tu estructura de archivos

// Consultar todos los perfiles
export const getAllProfiles = async () => {
  try {
    const response = await profileService.get('/profiles');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching profiles');
  }
};

// Crear un nuevo perfil
export const createProfile = async (profileData) => {
  try {
    const response = await profileService.post('/profiles', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating profile');
  }
};

// Consultar un perfil por email
export const getProfileByEmail = async (email) => {
  try {
    const response = await profileService.get(`/profiles/email/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching profile by email');
  }
};

// Actualizar un perfil existente
export const updateProfile = async (email, profileData) => {
  try {
    const response = await profileService.put(`/profiles/${email}`, profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating profile');
  }
};

// Borrar un perfil
export const deleteProfile = async (email) => {
  try {
    await profileService.delete(`/profiles/${email}`);
    return { message: 'Profile deleted successfully' };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting profile');
  }
};

// Cambiar estado de activo
export const toggleProfileActiveStatus = async (email) => {
  try {
    const response = await profileService.patch(`/profiles/${email}/toggle-active`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error toggling profile active status');
  }
};
