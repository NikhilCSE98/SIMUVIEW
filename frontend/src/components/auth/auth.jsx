// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

export const getToken = () => {
    return localStorage.getItem("jwt");
};

export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
};
