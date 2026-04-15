'use client';

import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/types';

const systemAlerts = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: 'WoredaNet API Sync Failure',
    description: 'Kebele ID verification requests failing. Affects all citizen authentication flows.',
    timestamp: '12 mins ago',
    affected: 'Kebele ID Gateway',
  },
  {
    id: 'alert-2',
    severity: 'warning',
    title: 'Telebirr Callback Queue Backlog',
    description: 'Payment webhook processing delayed by 45 minutes. Customers may experience pending payment status.',
    timestamp: '28 mins ago',
    affected: 'Telebirr Gateway',
  },
  {
    id: 'alert-3',
    severity: 'warning',
    title: 'E-Tax API Latency Spike',
    description: 'Average response time increased to 3.2s (SLA: <500ms). Investigating database query performance.',
    timestamp: '1 hour ago',
    affected: 'Ministry of Revenue API',
  },
];

function AlertCard({ alert }: { alert: typeof systemAlerts[0] }) {
  const isCritical = alert.severity === 'critical';
  
  return (
    <div className={`p-3 sm:p-4 rounded-lg border ${isCritical ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${isCritical ? 'bg-red-100' : 'bg-amber-100'}`}>
          <svg className={`w-4 h-4 ${isCritical ? 'text-red-600' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCritical ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'} />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
              {isCritical ? 'CRITICAL' : 'WARNING'}
            </span>
            <span className="text-xs text-slate-400">{alert.timestamp}</span>
          </div>
          <h4 className="font-semibold text-slate-800 mt-1 text-sm sm:text-base">{alert.title}</h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2">{alert.description}</p>
          <span className="text-xs text-slate-500 block mt-2">Affected: {alert.affected}</span>
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              Acknowledge
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-white bg-slate-700 rounded hover:bg-slate-800 transition-colors">
              View Protocol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user, isAdmin, isEmployee } = useAuth();
  const { articles } = useAppStore();

  const handleRoleChange = (_role: UserRole) => {
    // Role switch is handled in RoleSwitcher component via switchRole
  };

  const recentArticles = articles
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Government')) return '🏛️';
    if (category.includes('FinTech')) return '💳';
    return '⚙️';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* My Active Context Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Active Project</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-1">E-Passport Portal Integration</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">Ministry of Immigration • Sprint 4 of 8 • Deadline: May 15, 2025</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:ml-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-500">Sprint Progress</p>
              <p className="text-lg font-bold text-slate-800">62%</p>
            </div>
            <div className="w-20 sm:w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '62%' }} />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-slate-500">Stack:</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono">Node.js</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono">PostgreSQL</span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono hidden sm:inline">Redis</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm sm:ml-auto">
            <span className="text-slate-500">API Status:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-green-600 font-medium">Operational</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Alerts + Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Critical System Alerts - Left Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Critical System Alerts</h3>
              </div>
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                {systemAlerts.filter(a => a.severity === 'critical').length} Critical
              </span>
            </div>
            <div className="p-2 sm:p-4 space-y-2 sm:space-y-3 max-h-[400px] overflow-y-auto">
              {systemAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
              {systemAlerts.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <svg className="w-12 h-12 mx-auto text-green-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium">All systems operational</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links - Ops Tools */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ops Tools
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
              <a href="#" className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-xs sm:text-sm text-slate-700">Grafana</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-xs sm:text-sm text-slate-700">Datadog</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="w-2 h-2 bg-amber-400 rounded-full" />
                <span className="text-xs sm:text-sm text-slate-700">Runbook</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs sm:text-sm text-slate-700">PagerDuty</span>
              </a>
            </div>
          </div>
        </div>

        {/* Recent Architecture Updates - Right Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Recent Architecture Updates</h3>
              </div>
              <a href="/knowledge-base" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </a>
            </div>
            <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
              {recentArticles.map((article) => (
                <a
                  key={article.id}
                  href="/knowledge-base"
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-100 flex items-center justify-center text-base sm:text-lg">
                    {getCategoryIcon(article.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                      <h4 className="font-medium text-slate-800 hover:text-blue-600 line-clamp-2 text-sm sm:text-base">
                        {article.title}
                      </h4>
                      <span className="flex-shrink-0 text-xs text-slate-400">
                        {formatDate(article.updatedAt)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        article.category === 'Government Integrations' ? 'bg-purple-100 text-purple-700' :
                        article.category === 'FinTech & Payment Gateways' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {article.category.split(' ')[0]}
                      </span>
                      <span className="text-xs text-slate-400">{article.views} views</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                        {article.authorId === '1' ? 'BH' : article.authorId === '2' ? 'DK' : article.authorId === '3' ? 'TA' : article.authorId === '5' ? 'FW' : 'AG'}
                      </div>
                      <span className="text-xs text-slate-500 hidden sm:inline">
                        {article.authorId === '1' ? 'Bethel Haile' : 
                         article.authorId === '2' ? 'Daniel Kebede' : 
                         article.authorId === '3' ? 'Tigist Alemu' :
                         article.authorId === '5' ? 'Frehiwot Worku' : 'Abebe Girma'}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Actions - Developer Style */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <a href="/issues" className="flex flex-col items-center gap-1 p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-blue-50 border border-transparent transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs text-slate-600">New Ticket</span>
              </a>
              <a href="/knowledge-base" className="flex flex-col items-center gap-1 p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-blue-50 border border-transparent transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-xs text-slate-600">New Doc</span>
              </a>
              <a href="/community" className="flex flex-col items-center gap-1 p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-blue-50 border border-transparent transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <span className="text-xs text-slate-600">Post</span>
              </a>
              <a href="/learning" className="flex flex-col items-center gap-1 p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-blue-50 border border-transparent transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-xs text-slate-600">Learn</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Mode Footer */}
      <div className="bg-slate-800 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-sm text-slate-400 font-medium">Demo Mode Active</p>
            </div>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="text-xs sm:text-sm text-slate-400">
              <span className="hidden sm:inline">Logged in as:</span> <span className="text-white font-medium">{user?.name}</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                isAdmin ? 'bg-purple-500/20 text-purple-300' : 
                isAdmin ? 'bg-purple-500/20 text-purple-300' : 
                'bg-blue-500/20 text-blue-300'
              }`}>
                {isAdmin ? 'Admin' : 'Employee'}
              </span>
            </span>
          </div>
          <RoleSwitcher currentRole={user?.role || 'employee'} onRoleChange={handleRoleChange} />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
