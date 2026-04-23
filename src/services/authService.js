import axios from "axios";
import { API_BASE_URL } from "./config";
import { decodeJwt, isJwtExpired } from "../utils/jwt";
import { getItem, removeItem, setItem } from "../utils/storage";

const TOKEN_KEY = "banking_app_token";
const PROFILE_KEY = "banking_app_profile";

// ================= TOKEN =================
export const saveToken = (token) => setItem(TOKEN_KEY, token);
export const getToken = () => getItem(TOKEN_KEY);
export const clearToken = () => removeItem(TOKEN_KEY);

// ================= PROFILE =================
export const saveUserProfile = (profile) =>
    setItem(PROFILE_KEY, JSON.stringify(profile));

export const getUserProfile = () => {
    const value = getItem(PROFILE_KEY);
    return value ? JSON.parse(value) : null;
};

export const clearUserProfile = () => removeItem(PROFILE_KEY);

export const logout = () => {
    clearToken();
    clearUserProfile();
};

// ================= JWT =================
export const decodeToken = (token) => decodeJwt(token);

export const getUserRole = () => {
    const token = getToken();
    const decoded = decodeToken(token);
    const profile = getUserProfile();

    if (profile?.role) return profile.role;
    if (!decoded) return null;

    return decoded.role || decoded.roles?.[0];
};

export const getUserName = () => {
    const profile = getUserProfile();
    return profile?.fullName || profile?.name || 'User';
};

export const isTokenValid = () => {
    const token = getToken();
    return token && !isJwtExpired(token);
};

// ================= AUTH APIs =================
export const register = async (data) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, data);
    return res.data;
};

export const login = async (data) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, data);

    // ✅ IMPORTANT
    saveToken(res.data.token);

    return res.data;
};