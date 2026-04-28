import { Navigate, Outlet } from "react-router-dom";

// Assuming you have a way to get user auth state, e.g., from context or localStorage
// You'll need to implement getCurrentUser and checkRole functions based on your auth system

const getCurrentUser = () => {
  // Replace with your auth logic, e.g., check localStorage or context
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (token) {
    // Decode token or fetch user info
    return { role: role || 'user' }; // Fetch role from localStorage
  }
  return null;
};

const checkRole = (user, allowedRoles) => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

export const PrivateRoute = ({ allow }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allow && !checkRole(user, allow)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const user = getCurrentUser();

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
