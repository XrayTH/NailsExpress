import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from '../features/authSlice';
import userReducer from '../features/userSlice';

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

// Reducers persistentes
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

// Configuración del store con los reducers persistentes
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: persistedUserReducer,
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

