'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'texwear_admin_session_v1';
const DEFAULT_ADMIN_PASSCODE = 'admin123'; // Default secret passcode for Admin

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (session === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('Failed to load admin session', e);
    }
    setIsLoaded(true);
  }, []);

  const login = (password: string): boolean => {
    if (password === DEFAULT_ADMIN_PASSCODE || password === 'texwear2026') {
      setIsAuthenticated(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  if (!isLoaded) return null;

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
