import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service"; // Adjust path as needed

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  // Check if the user is authenticated
  const isAuthenticated = AuthService.isAuthenticated();

  // If not authenticated, redirect to the 403 page
  return isAuthenticated ? element : <Navigate to="/403" replace />;
};

export default PrivateRoute;
