import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Outlet />
  ) : isAuthenticated === null ? (
    ''
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
