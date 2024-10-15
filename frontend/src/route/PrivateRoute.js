import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const PrivateRoute = () => {
  const { authState } = useAuth(); // Get the auth state using the useAuth hook

  return(
    authState.isAuthenticated ? <Outlet/> : <Navigate to ="/login"/>
  )
}

export default PrivateRoute;
