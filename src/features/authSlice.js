import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

// Selector para obtener el usuario autenticado
export const selectAuthUser = (state) => state.auth.user;

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;




