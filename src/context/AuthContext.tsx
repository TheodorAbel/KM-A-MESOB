'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAdmin: boolean;
  isSenior: boolean;
  isJunior: boolean;
}

const defaultAuth: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
  isAdmin: false,
  isSenior: false,
  isJunior: false,
};

const AuthContext = createContext<AuthContextType>(defaultAuth);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, switchRole, setCurrentUser } = useAppStore();

  const login = useCallback((role: UserRole) => {
    switchRole(role);
  }, [switchRole]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const isAdmin = currentUser?.role === 'admin';
  const isSenior = currentUser?.role === 'senior' || currentUser?.role === 'admin';
  const isJunior = currentUser?.role === 'junior';

  const value = useMemo(
    () => ({ user: currentUser, login, logout, isAdmin, isSenior, isJunior }),
    [currentUser, login, logout, isAdmin, isSenior, isJunior]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
