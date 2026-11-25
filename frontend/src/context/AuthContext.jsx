import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { getAuthToken, clearAuthSession } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify session against backend
  const verifySession = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const verifiedUser = await authService.getMe();
      if (verifiedUser) {
        setUser(verifiedUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Session verification failed:', err.message);
      clearAuthSession();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('bhumi:auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('bhumi:auth:unauthorized', handleUnauthorized);
    };
  }, [verifySession]);

  const login = async (email, password) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const googleLogin = async (credential) => {
    const loggedInUser = await authService.googleLogin(credential);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    login,
    googleLogin,
    logout,
    refreshSession: verifySession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
