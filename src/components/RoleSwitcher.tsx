'use client';

import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles: { value: UserRole; label: string; color: string }[] = [
  { value: 'junior', label: 'Junior Employee', color: 'bg-green-100 text-green-800' },
  { value: 'senior', label: 'Senior / Team Lead', color: 'bg-blue-100 text-blue-800' },
  { value: 'admin', label: 'Admin / HR', color: 'bg-purple-100 text-purple-800' },
];

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-slate-500 font-medium px-2">Switch Role (Demo):</p>
      {roles.map((role) => (
        <button
          key={role.value}
          onClick={() => onRoleChange(role.value)}
          className={`text-left px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
            currentRole === role.value
              ? `${role.color} ring-2 ring-offset-1 ring-slate-300`
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}
