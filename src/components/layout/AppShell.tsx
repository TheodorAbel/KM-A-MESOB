'use client';

import { TopNavbar } from './TopNavbar';
import { LeftSidebar } from './LeftSidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar />
      <LeftSidebar />
      <main className="ml-64 pt-16 min-h-screen transition-all duration-300">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
