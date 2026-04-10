'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAdmin: boolean;
  isSenior: boolean;
  isJunior: boolean;
}

const mockUsers: Record<UserRole, User> = {
  junior: {
    id: '1',
    name: 'Bethel Haile',
    email: 'bethel.haile@a-mesob.et',
    role: 'junior',
    department: 'Customer Service',
    joinDate: '2025-03-15',
  },
  senior: {
    id: '2',
    name: 'Daniel Kebede',
    email: 'daniel.kebede@a-mesob.et',
    role: 'senior',
    department: 'Operations',
    joinDate: '2023-08-01',
  },
  admin: {
    id: '3',
    name: 'Tigist Alemu',
    email: 'tigist.alemu@a-mesob.et',
    role: 'admin',
    department: 'Human Resources',
    joinDate: '2022-01-10',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUsers.admin);

  const login = useCallback((role: UserRole) => {
    setUser(mockUsers[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isSenior = user?.role === 'senior' || user?.role === 'admin';
  const isJunior = user?.role === 'junior';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isSenior, isJunior }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
