import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import useRole from "../hooks/useRole";

const ManagerRoute = ({ children }) => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [role, roleLoading] = useRole();
    const location = useLocation();

    if (authLoading || roleLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (user && role === 'manager') {
        return children;
    }

    // If logged in but not manager, redirect to dashboard home
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ManagerRoute;
