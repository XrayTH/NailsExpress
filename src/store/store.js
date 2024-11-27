import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/authSlice';
import userReducer from '../features/userSlice';
import domicileReducer from '../features/domicileSlice'; // Importar el nuevo slice

// Configuración de persistencia para `authReducer`
const authPersistConfig = {
  key: 'auth',
  storage,
};

// Configuración de persistencia para `userReducer`
const userPersistConfig = {
  key: 'user',
  storage,
};

// Configuración de persistencia para `domicileReducer`
const domicilePersistConfig = {
  key: 'domicile',
  storage,
};

// Reducers persistentes
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedDomicileReducer = persistReducer(
  domicilePersistConfig,
  domicileReducer
);

// Configuración del store con los reducers persistentes
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: persistedUserReducer,
    domicile: persistedDomicileReducer, // Agregar el reducer del domicilio
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Configuración del persistor
export const persistor = persistStore(store);


