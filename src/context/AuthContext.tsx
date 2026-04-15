'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { User, UserRole, Department } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, department: Department, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isEmployee: boolean;
  switchRole: (role: UserRole) => void;
}

const defaultAuth: AuthContextType = {
  user: null,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  isAdmin: false,
  isEmployee: true,
  switchRole: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuth);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, switchRole, setCurrentUser, users, setUsers } = useAppStore();

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user && password.length >= 6) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, [users, setCurrentUser]);

  const signup = useCallback(async (
    name: string,
    email: string,
    password: string,
    department: Department,
    role: UserRole
  ): Promise<boolean> => {
    if (password.length < 6) return false;
    
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) return false;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      department,
      joinDate: new Date().toISOString().split('T')[0],
      technicalSkills: [],
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  }, [users, setUsers, setCurrentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);

  const isAdmin = currentUser?.role === 'admin';
  const isEmployee = currentUser?.role === 'employee';

  const value = useMemo(
    () => ({ user: currentUser, login, signup, logout, isAdmin, isEmployee, switchRole }),
    [currentUser, login, signup, logout, isAdmin, isEmployee, switchRole]
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
