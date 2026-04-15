'use client';

import { UserRole } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles: { value: UserRole; label: string; color: string; bgColor: string; borderColor: string }[] = [
  { 
    value: 'employee', 
    label: 'Employee', 
    color: 'text-blue-700', 
    bgColor: 'bg-blue-50', 
    borderColor: 'border-blue-200' 
  },
  { 
    value: 'admin', 
    label: 'Admin / HR', 
    color: 'text-purple-700', 
    bgColor: 'bg-purple-50', 
    borderColor: 'border-purple-200' 
  },
];

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const { switchRole } = useAuth();
  
  const handleRoleChange = (role: UserRole) => {
    onRoleChange(role);
    switchRole(role);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <p className="text-xs text-slate-500 font-medium">Demo Mode Active</p>
      </div>
      <div className="space-y-1">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => handleRoleChange(role.value)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
              currentRole === role.value
                ? `${role.bgColor} ${role.color} ${role.borderColor} ring-2 ring-offset-1`
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{role.label}</p>
              </div>
              {currentRole === role.value && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 text-center px-2">
        Click to switch roles for demo
      </p>
    </div>
  );
}
