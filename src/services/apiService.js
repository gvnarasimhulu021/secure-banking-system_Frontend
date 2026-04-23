import axios from "axios";
import { getToken, logout } from "./authService";
import { API_BASE_URL } from "./config";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Request interceptor - add token to all requests
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Response interceptor - handle unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;