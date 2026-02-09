import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  console.log('ProtectedRoute - Vérification du token:', !!token);

  if (!token) {
    console.warn('Pas de token - Redirection vers login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;