import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    userType: null, // Nuevo campo para el tipo de usuario
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.userType = action.payload.userType; // Guardar el tipo de usuario
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.userType = null; // Limpiar el tipo de usuario al cerrar sesión
    },
  },
});

// Selector para obtener el usuario
export const selectUser = (state) => state.user.user;
export const selectUserType = (state) => state.user.userType; // Selector para obtener el tipo de usuario

export const { setUser, setStatus, setError, logoutUser } = userSlice.actions;
export default userSlice.reducer;



