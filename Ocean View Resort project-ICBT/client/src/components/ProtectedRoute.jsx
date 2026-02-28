import { Navigate } from "react-router-dom";
import { authAPI } from "../services/api";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const user = authAPI.getCurrentUser();
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    const userRoles = Array.from(user.roles || []);
    const hasAdminRole = userRoles.includes("ADMIN");
    if (!hasAdminRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
