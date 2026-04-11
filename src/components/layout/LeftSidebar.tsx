'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArticleCategory } from '@/types';

interface NavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: { label: string; href: string; category?: ArticleCategory }[];
  adminOnly?: boolean;
}

const kbCategories = [
  { label: 'All Articles', href: '/knowledge-base', category: undefined as undefined },
  { label: 'HR Policies', href: '/knowledge-base?category=HR%20Policies', category: 'HR Policies' as ArticleCategory },
  { label: 'IT Procedures', href: '/knowledge-base?category=IT%20Procedures', category: 'IT Procedures' as ArticleCategory },
  { label: 'Quality Guidelines', href: '/knowledge-base?category=Quality%20Guidelines', category: 'Quality Guidelines' as ArticleCategory },
];

const navSections: NavSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge Base',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    subItems: kbCategories,
  },
  {
    id: 'community',
    label: 'Community Board',
    href: '/community',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'issue-logs',
    label: 'Issue Logs',
    href: '/issues',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 'learning',
    label: 'Learning Pathways',
    href: '/learning',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    href: '/admin',
    adminOnly: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'exit-workflows',
    label: 'Exit Workflows',
    href: '/exit-workflows',
    adminOnly: true,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
  },
];

export function LeftSidebar() {
  const { isAdmin } = useAuth();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['knowledge-base']);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('?')[0]);
  };

  const visibleSections = navSections.filter((section) => !section.adminOnly || isAdmin);

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-slate-800 text-white transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!isCollapsed && (
            <span className="text-sm font-medium text-slate-300">Main Menu</span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          <ul className="space-y-1 px-2">
            {visibleSections.map((section) => (
              <li key={section.id}>
                {section.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive('/knowledge-base')
                          ? 'bg-blue-600 text-white'
                          : expandedItems.includes(section.id)
                            ? 'bg-slate-700/50 text-white'
                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                      title={isCollapsed ? section.label : undefined}
                    >
                      {section.icon}
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left text-sm font-medium">
                            {section.label}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              expandedItems.includes(section.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                    {!isCollapsed && expandedItems.includes(section.id) && (
                      <ul className="mt-1 ml-4 pl-4 border-l border-slate-600 space-y-1">
                        {section.subItems.map((subItem, idx) => (
                          <li key={idx}>
                            <Link
                              href={subItem.href}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                            >
                              <svg className="w-1.5 h-1.5 rounded-full bg-current shrink-0" fill="currentColor" viewBox="0 0 6 6">
                                <circle cx="3" cy="3" r="3" />
                              </svg>
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={section.href || '/'}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive(section.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    title={isCollapsed ? section.label : undefined}
                  >
                    {section.icon}
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{section.label}</span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {!isCollapsed && (
          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-xs text-slate-400 mb-1">Need Help?</p>
              <p className="text-sm text-slate-200">Contact IT Support</p>
              <p className="text-xs text-slate-400">support@a-mesob.et</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
