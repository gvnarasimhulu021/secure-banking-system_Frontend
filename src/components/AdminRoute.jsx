import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || role !== 'ADMIN') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
