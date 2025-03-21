import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth); // Ensure loading is included
  const location = useLocation();

    // Wait until authentication data is available
    if (loading || user === undefined) {
      return <div>Loading...</div>; // Prevent infinite loading issue
    }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const redirectPath =
      user?.role === ROLES.ADMIN
        ? "/admin/dashboard"
        : user?.role === ROLES.TEACHER
        ? "/teacher/dashboard"
        : user?.role === ROLES.STUDENT
        ? "/student/dashboard"
        : "/login";

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.array,
};

export default ProtectedRoute;
