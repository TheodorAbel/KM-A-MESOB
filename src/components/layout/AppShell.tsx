'use client';

import { useState } from 'react';
import { TopNavbar } from './TopNavbar';
import { LeftSidebar } from './LeftSidebar';
import { useAuth } from '@/context/AuthContext';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopNavbar onMenuToggle={toggleMobileMenu} />
      
      <div className="flex flex-1 pt-16">
        <LeftSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
        
        <main className="flex-1 lg:ml-0 min-h-[calc(100vh-4rem)] transition-all duration-300">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>

      <footer className="bg-white border-t border-slate-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">A-Mesob KMS</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-xs text-slate-500">Knowledge Management System</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-green-700">Demo Mode</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hidden sm:inline">Logged in as:</span>
              <span className="font-medium text-slate-700">{user?.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {user?.role === 'admin' ? 'Admin' : 'Employee'}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
