import axios from 'axios';
import { decodeJwt, isJwtExpired } from '../utils/jwt';
import { getItem, removeItem, setItem } from '../utils/storage';
import { API_BASE_URL } from './config';

const TOKEN_KEY = 'banking_app_token';
const PROFILE_KEY = 'banking_app_profile';

// Clean axios instance without interceptors for auth
const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

const TOKEN_KEY = 'banking_app_token';
const PROFILE_KEY = 'banking_app_profile';

export function saveToken(token) {
    setItem(TOKEN_KEY, token);
}

export function getToken() {
    return getItem(TOKEN_KEY);
}

export function clearToken() {
    removeItem(TOKEN_KEY);
}

export function saveUserProfile(profile) {
    setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getUserProfile() {
    const value = getItem(PROFILE_KEY);
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

export function clearUserProfile() {
    removeItem(PROFILE_KEY);
}

export function logout() {
    clearToken();
    clearUserProfile();
}

export function decodeToken(token) {
    return decodeJwt(token);
}

export function getUserRole() {
    const token = getToken();
    const decoded = decodeToken(token);
    const profile = getUserProfile();
    if (profile?.role) return profile.role;
    if (!decoded) return null;
    return decoded.role || (decoded.roles ? decoded.roles[0] : null);
}

export function getUserName() {
    const profile = getUserProfile();
    if (profile?.fullName) return profile.fullName;
    if (profile?.name) return profile.name;

    const token = getToken();
    const decoded = decodeToken(token);
    if (!decoded) return null;
    return decoded.fullName || decoded.name || decoded.email || decoded.sub || null;
}

export function isTokenValid() {
    const token = getToken();
    if (!token) return false;
    return !isJwtExpired(token);
}

export async function register(credentials) {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, credentials, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export async function login(credentials) {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}
