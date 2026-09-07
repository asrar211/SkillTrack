import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/AuthContext";

function ProtectedRoute() {
    const {
        isAuthenticated,
        isLoading,
    } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50">
                <div className="size-8 animate-spin rounded-full border-2 border-zinc-200 border-t-pink-500" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;