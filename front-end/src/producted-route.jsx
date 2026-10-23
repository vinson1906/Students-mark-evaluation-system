import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./constant/constant";

const ProtectedRoute = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["auth-success"],
        queryFn: async () => {
            const response = await fetch(
                `${BASE_URL}/user/auth-success`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Authentication failed");
            }

            return response.json();
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                Checking authentication...
            </div>
        );
    }

    if (isError || !data?.success) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;