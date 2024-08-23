import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element }) {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return element;
}

export default ProtectedRoute;
