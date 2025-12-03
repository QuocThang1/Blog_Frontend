import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context.jsx";


/**
 * @param {ReactNode} children 
 * @param {Array<string>} allowedRoles 
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(auth.user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
