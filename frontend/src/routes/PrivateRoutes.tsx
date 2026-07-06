import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
    allowedRoles?: ("ADMIN" | "BARBER" | "CLIENT")[];
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Carregando...</div>; 
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; 
    }

    return <Outlet />;
}