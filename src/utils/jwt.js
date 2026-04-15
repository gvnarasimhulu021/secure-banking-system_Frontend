function base64UrlDecode(value) {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const decoded = atob(padded);
    try {
        return decodeURIComponent(
            decoded
                .split('')
                .map((char) => `%${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
    } catch {
        return decoded;
    }
}

export function decodeJwt(token) {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
        return JSON.parse(base64UrlDecode(parts[1]));
    } catch {
        return null;
    }
}

export function isJwtExpired(token) {
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
}
