import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on mount
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (firstName, lastName, email, password) => {
    const data = await authAPI.register(firstName, lastName, email, password);
    return data;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const updateAccount = async (updates) => {
    const data = await authAPI.updateAccount(updates);
    setUser(data.user);
    return data;
  };

  const deleteAccount = async (currentPassword) => {
    const data = await authAPI.deleteAccount(currentPassword);
    setUser(null);
    return data;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateAccount,
    deleteAccount,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
