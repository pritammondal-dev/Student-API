import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentRoute() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/student/login" replace />;
  }

  if (role !== "student") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default StudentRoute;