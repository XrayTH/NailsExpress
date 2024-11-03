import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PruebaLeaflet from './components/pruebas/PruebaLeaflet';
import UserList from './components/pruebas/UserList';
import Login from './pages/Login';
import Home from './pages/Home';
import Inicio from './pages/Inicio';
import Perfil from './pages/Perfil';
import Registro from './pages/Registro';
import Mapa from './pages/Mapa';
import Admin from './pages/Admin';
import PruebaImagen from './components/pruebas/PruebaImagen';
import PrivateRoute from './components/seguridad/PrivateRoute'; // Importa el componente de rutas privadas
import { selectUser } from './features/userSlice'; // Importa el selector para verificar el estado de autenticación
import NotFound from './components/seguridad/NotFound';
import { selectAuthUser } from './features/authSlice';

const Prueba = () => {
  return (
    <div>
      <PruebaLeaflet />
      <UserList />
      <PruebaImagen />
    </div>
  );
};

function App() {
  const user = useSelector(selectUser); 
  const auth = useSelector(selectAuthUser);
  console.log(Boolean(user && auth))

  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path='/' element={user && auth ? <Inicio /> : <Home />} />

        {/* Redirige a /home si el usuario ya está logueado */}
        <Route
          path='/login'
          element={user && auth ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path='/Registro'
          element={user && auth ? <Navigate to="/" /> : <Registro />}
        />

        {/* Rutas protegidas: solo accesibles si el usuario está logueado */}
        <Route
          path='/Inicio'
          element={
            <PrivateRoute>
              <Inicio />
            </PrivateRoute>
          }
        />
        <Route
          path='/Mapa'
          element={
            <PrivateRoute>
              <Mapa />
            </PrivateRoute>
          }
        />
        <Route
          path='/Perfil'
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />

        {/* Ruta protegida solo para administradores */}
        <Route
          path='/Admin'
          element={
            <PrivateRoute requiresAdmin={true}>
              <Admin />
            </PrivateRoute>
          }
        />

        {/* Ruta de pruebas */}
        <Route path='/Pruebas' element={<Prueba />} />

        {/* Redirige cualquier ruta desconocida a / */}
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
}

export default App;
