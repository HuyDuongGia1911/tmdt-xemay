// src/lib/axios.js
import axios from "axios";
import { STORAGE_TOKEN_KEY } from "../config/constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
});

// ========== REQUEST INTERCEPTOR ==========
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (!config.headers["Content-Type"])
        config.headers["Content-Type"] = "application/json";

    return config;
});

// ========== RESPONSE INTERCEPTOR ==========
api.interceptors.response.use(
    (res) => res,

    (error) => {
        const status = error?.response?.status;
        const data = error?.response?.data;

        // ⭐ CASE 1: user chưa có cửa hàng → backend trả needs_seller_setup = true
        if (data?.needs_seller_setup) {
            window.location.assign("/dashboard/seller/setup");
            return;
        }

        // ⭐ CASE 2: Token hết hạn hoặc bị revoke
        if (status === 401) {
            localStorage.removeItem(STORAGE_TOKEN_KEY);

            if (window.location.pathname !== "/login") {
                window.location.assign("/login");
            }
        }

        return Promise.reject(error);
    }
);

export default api;
