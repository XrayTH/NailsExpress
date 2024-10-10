import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PruebaLeaflet from './components/pruebas/PruebaLeaflet';
import UserList from './components/pruebas/userList'; // Cambiar a mayúscula
import Login from './pages/Login';
import Home from './pages/Home';
import Inicio from './pages/Inicio';
import Perfil from './pages/Perfil';
import Registro from './pages/Registro';
import Mapa from './pages/Mapa';
import Admin from './pages/Admin';
import PruebaImagen from './components/pruebas/PruebaImagen';

const Prueba = () => {
  return(
    <div>
      <PruebaLeaflet/>
      <UserList/> {/* Cambiar a mayúscula */}
      <PruebaImagen/>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Inicio' element={<Inicio />} />
        <Route path='/Mapa' element={<Mapa />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Perfil' element={<Perfil />} />
        <Route path='/Registro' element={<Registro />} />
        <Route path='/Admin' element={<Admin />} />
        <Route path='/Pruebas' element={<Prueba />} />
        
        {/* Redirección si no se encuentra la ruta */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;