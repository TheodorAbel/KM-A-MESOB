'use client';

import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { UserRole } from '@/types';

const stats = [
  { label: 'Knowledge Articles', value: '127', change: '+12 this month', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { label: 'Active Issue Logs', value: '23', change: '5 high priority', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { label: 'Team Members', value: '48', change: '12 juniors, 28 seniors', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { label: 'Learning Pathways', value: '15', change: '4 newly enrolled', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
];

const recentActivity = [
  { action: 'New article published', item: 'Customer Service Escalation Procedures', user: 'Daniel K.', time: '2 hours ago' },
  { action: 'Issue resolved', item: 'Login authentication timeout error', user: 'Bethel H.', time: '4 hours ago' },
  { action: 'Learning completed', item: 'Digital Signage Fundamentals', user: 'Samuel T.', time: '5 hours ago' },
  { action: 'Process map updated', item: 'New Business Registration Flow', user: 'Tigist A.', time: 'Yesterday' },
];

const quickActions = [
  { label: 'Submit Issue', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'bg-red-500' },
  { label: 'New Article', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'bg-blue-500' },
  { label: 'Start Learning', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'bg-green-500' },
  { label: 'View Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'bg-purple-500' },
];

function DashboardContent() {
  const { user, login, isAdmin } = useAuth();

  const handleRoleChange = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-1">
            Here&apos;s what&apos;s happening at A-Mesob Service Center today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            isAdmin ? 'bg-purple-100 text-purple-800' : 
            user?.role === 'senior' ? 'bg-blue-100 text-blue-800' : 
            'bg-green-100 text-green-800'
          }`}>
            {isAdmin ? 'Admin / HR' : user?.role === 'senior' ? 'Team Lead' : 'Junior Employee'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800">
                    <span className="font-medium">{activity.action}</span>{' '}
                    <span className="text-slate-500">— {activity.item}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all group"
              >
                <div className={`p-2.5 rounded-lg ${action.color}`}>
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={action.icon}
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800">
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Role Switcher (Demo)</h3>
            <RoleSwitcher currentRole={user?.role || 'junior'} onRoleChange={handleRoleChange} />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Knowledge Retention Initiative</h2>
            <p className="text-blue-100 mt-1">
              Preserving experiential knowledge to prevent brain drain. Every contribution matters.
            </p>
          </div>
          <button className="px-5 py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
            Document Knowledge
          </button>
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
