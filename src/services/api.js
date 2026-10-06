import axios from 'axios';

// Base API URL configured via environment variable with production/local fallback
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT auth token if available
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('vedha_user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch {
        // ignore parse error
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for structured error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred.';
    if (error.response) {
      message = error.response.data?.message || `Server error (${error.response.status})`;
    } else if (error.request) {
      message = 'Cannot connect to backend API server. Please verify the service is running.';
    } else {
      message = error.message;
    }
    const customError = new Error(message);
    customError.originalError = error;
    customError.status = error.response?.status;
    customError.response = error.response;
    return Promise.reject(customError);
  }
);

export default api;
export { API_BASE_URL };
