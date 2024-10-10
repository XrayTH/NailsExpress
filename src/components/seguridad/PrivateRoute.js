import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser, selectUserType } from '../../features/userSlice'; // Importa los selectores

// Componente para proteger rutas
const PrivateRoute = ({ children, requiresAdmin = false }) => {
  const user = useSelector(selectUser);
  const userType = useSelector(selectUserType);

  // Si no está logueado, redirige a /login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si la ruta requiere ser admin y el usuario no lo es, redirige a /home
  if (requiresAdmin && userType !== 'admin') {
    return <Navigate to="/home" />;
  }

  // Si todo está correcto, renderiza el componente solicitado
  return children;
};

export default PrivateRoute;
