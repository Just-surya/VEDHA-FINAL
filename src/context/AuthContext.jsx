import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'vedha_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      let userData = null;

      try {
        const res = await api.post('/auth/login', {
          username: username.trim(),
          password: password.trim(),
        });

        if (res.data?.success && res.data?.user) {
          userData = {
            ...res.data.user,
            token: res.data.token,
            signedInAt: new Date().toISOString(),
          };
        }
      } catch (err) {
        // If server explicitly returned 401/400 (wrong credentials), propagate error
        if (
          err.status === 401 ||
          err.status === 400 ||
          err.response?.status === 401 ||
          err.response?.status === 400
        ) {
          throw err;
        }

        // If backend server is unreachable (offline mode fallback)
        if (username.trim() === 'admin' && password.trim() === 'admin123') {
          userData = {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            username: 'admin',
            name: 'Staff Administrator',
            role: 'Academic Coordinator',
            department: 'High School Wing',
            token: `token-${Date.now()}`,
            signedInAt: new Date().toISOString(),
          };
        } else {
          throw err;
        }
      }

      if (userData) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      } else {
        throw new Error('Invalid credentials. Please verify your username and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
