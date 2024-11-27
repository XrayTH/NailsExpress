import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,       // ID del domicilio
  state: null,    // Estado del domicilio
};

const domicileSlice = createSlice({
  name: 'domicile',
  initialState,
  reducers: {
    // Acción para establecer el ID del domicilio
    setDomicileId: (state, action) => {
      state.id = action.payload; // Guardar el ID proporcionado
    },
    // Acción para establecer el estado del domicilio
    setDomicileState: (state, action) => {
      state.state = action.payload; // Guardar el estado proporcionado
    },
    // Acción para limpiar el ID y el estado (como logout)
    clearDomicile: (state) => {
      state.id = null;   // Limpiar el ID
      state.state = null; // Limpiar el estado
    },
  },
});

// Selectores para acceder al estado del domicilio
export const selectDomicileId = (state) => state.domicile.id;
export const selectDomicileState = (state) => state.domicile.state;

// Exportar las acciones generadas automáticamente
export const { setDomicileId, setDomicileState, clearDomicile } = domicileSlice.actions;

// Exportar el reducer del slice del domicilio
export default domicileSlice.reducer;
