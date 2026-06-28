import axios from "axios";

// Base URL is configured via VITE_API_URL environment variable.
// This allows seamless switching between dev / staging / production without
// touching any component or service files.
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ── Request interceptor ──────────────────────────────────────────────────────
// Attaches the access token from localStorage to every outgoing request.
// The token key matches what authSlice.js stores: "accessToken".
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────────────
// Normalises error objects so every thunk can rely on err.response.data.message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // In development, log the raw error for debugging.
    if (import.meta.env.DEV) {
      console.error("[API Error]", error.response?.status, error.config?.url, error.message);
    }
    return Promise.reject(error);
  }
);

export default api;