import { createSlice } from '@reduxjs/toolkit';

// Estado inicial para el slice del usuario
const initialState = {
  user: null,
  userType: null, // Campo para diferenciar entre cliente o profesional
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null, // Para manejar errores
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Acción para establecer el usuario y su tipo
    setUser: (state, action) => {
      state.user = action.payload.user; // Guardar el objeto de usuario
      state.userType = action.payload.userType; // Guardar el tipo de usuario (cliente o profesional)
    },
    // Acción para actualizar el estado de carga
    setStatus: (state, action) => {
      state.status = action.payload; // Actualizar el estado ('idle', 'loading', etc.)
    },
    // Acción para establecer errores
    setError: (state, action) => {
      state.error = action.payload; // Guardar el mensaje de error
    },
    // Acción para cerrar sesión y limpiar el estado
    logoutUser: (state) => {
      state.user = null; // Limpiar el usuario
      state.userType = null; // Limpiar el tipo de usuario
      state.status = 'idle'; // Restablecer el estado a 'idle'
      state.error = null; // Limpiar los errores
    },
  },
});

// Selectores para acceder al estado del usuario y su tipo
export const selectUser = (state) => state.user.user;
export const selectUserType = (state) => state.user.userType;
export const selectStatus = (state) => state.user.status;
export const selectError = (state) => state.user.error;

// Exportar las acciones generadas automáticamente
export const { setUser, setStatus, setError, logoutUser } = userSlice.actions;

// Exportar el reducer del slice del usuario
export default userSlice.reducer;
