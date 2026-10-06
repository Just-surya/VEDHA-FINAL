import axios from 'axios';

// Base API URL configured via environment variable with localhost fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach auth token/session if available
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
      message = error.response.data?.message || `Server responded with status ${error.response.status}`;
    } else if (error.request) {
      message = 'Cannot connect to API server. Please make sure json-server is running on port 5000.';
    } else {
      message = error.message;
    }
    const customError = new Error(message);
    customError.originalError = error;
    customError.status = error.response?.status;
    return Promise.reject(customError);
  }
);

export default api;
export { API_BASE_URL };
