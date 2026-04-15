import { Navigate, useLocation } from 'react-router-dom';
import { getToken, getUserRole, isTokenValid, logout } from '../services/authService';

function ProtectedRoute({ children, requiredRole }) {
    const token = getToken();
    const role = getUserRole();
    const location = useLocation();

    if (!token || !isTokenValid()) {
        logout();
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
