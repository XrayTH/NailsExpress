import { userService } from '../utils/api'; // Ajusta la ruta según tu estructura de archivos

// Consultar todos los administradores
export const getAllAdmins = async () => {
  try {
    const response = await userService.get('/admins');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching admins');
  }
};

// Crear un nuevo administrador
export const createAdmin = async (adminData) => {
  try {
    const response = await userService.post('/admins', adminData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating admin');
  }
};

// Modificar un administrador existente
export const updateAdmin = async (id, adminData) => {
  try {
    const response = await userService.put(`/admins/${id}`, adminData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating admin');
  }
};

// Borrar un administrador
export const deleteAdmin = async (id) => {
  try {
    await userService.delete(`/admins/${id}`);
    return { message: 'Admin deleted successfully' };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting admin');
  }
};

export const toggleAdminActiveStatus = async (email) => {
  try {
    const response = await userService.patch(`/admins/${email}/toggle-active`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error toggling admin active status');
  }
};
