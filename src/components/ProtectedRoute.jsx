import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../services/api";

export default function ProtectedRoute({ children }) {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
