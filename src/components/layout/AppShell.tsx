'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TopNavbar } from './TopNavbar';
import { LeftSidebar } from './LeftSidebar';
import { useAuth } from '@/context/AuthContext';

interface AppShellProps {
  children: React.ReactNode;
}

const publicPaths = ['/auth/signin', '/auth/signup'];

export function AppShell({ children }: AppShellProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    
    if (!user && !isPublicPath) {
      router.push('/auth/signin');
    } else {
      setIsLoading(false);
    }
  }, [user, pathname, router]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <span className="text-white text-xl font-bold">A</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar onMenuToggle={toggleMobileMenu} />
      
      <div className="flex">
        <LeftSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
        
        <main className="flex-1 lg:ml-0 transition-all duration-300">
          <div className="p-4 sm:p-4 min-h-[calc(100vh-64px)]">{children}</div>
        </main>
      </div>

      <footer className="bg-white border-t border-slate-200 px-4 sm:px-4 py-3">
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
