import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PruebaLeaflet from './components/pruebas/PruebaLeaflet';
import UserList from './components/pruebas/UserList';
import Login from './pages/Login'
import Home from './pages/Home'
import Inicio from './pages/Inicio'
import Perfil from './pages/Perfil'
import Registro from './pages/Registro'
import Mapa from './pages/Mapa'
import Admin from './pages/Admin'
import PruebaImagen from './components/pruebas/PruebaImagen';

const Prueba = () => {
  return(
    <div>
      <PruebaLeaflet/>
      <UserList/>
      <PruebaImagen/>
    </div>
  )
}

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/*
          <Route path='/login' element={<Login/>} />
          <Route path='/' element={<Home/>} />
          <Route path='/Home' element={<Inicio/>} />
          <Route path='/Perfil' element={<Perfil/>} />
          <Route path='/Registro' element={<Registro/>} />
          <Route path='/Mapa' element={<Mapa/>} />
          <Route path='/Admin' element={<Admin/>} />
          <Route path='/Pruebas' element={<Prueba/>} />
          */}
          <Route path='/' element={<Prueba/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
