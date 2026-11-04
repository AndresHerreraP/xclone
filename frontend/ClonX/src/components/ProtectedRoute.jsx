import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../services/authService";

export function ProtectedRoute() {
  return getToken() ? <Outlet /> : <Navigate to="/login" replace />;
}
