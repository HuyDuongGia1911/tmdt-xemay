import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireSeller({ children }) {
    const { user, seller, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        // Chờ user load xong từ AuthContext
        if (!user) return;

        if (!seller) {
            navigate("/dashboard/seller/setup");
        }
    }, [user, seller, navigate]);

    return <>{children}</>;
}
