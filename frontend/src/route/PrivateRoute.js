import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({children}) => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return <div>Loading...</div>; // Adjust based on your preferred loading UI
  }

  return authState.isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
