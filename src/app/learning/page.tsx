'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout';
import { SkillPhase } from '@/components/learning/SkillTree';

const phases = [
  {
    id: 'hr',
    title: 'HR Orientation',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    skills: [
      { id: 'hr-1', title: 'Company Culture & Values', description: 'Understanding A-Mesob mission and service principles', completed: false, locked: false },
      { id: 'hr-2', title: 'Code of Conduct', description: 'Professional behavior and ethics guidelines', completed: false, locked: false },
      { id: 'hr-3', title: 'Leave & Benefits Policy', description: 'Understanding employee benefits and leave procedures', completed: false, locked: false },
      { id: 'hr-4', title: 'IT Security Basics', description: 'Password security, data protection, and acceptable use', completed: false, locked: false },
    ],
  },
  {
    id: 'dept',
    title: 'Departmental Training',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    skills: [
      { id: 'dept-1', title: 'Department Workflow', description: 'Understanding departmental processes and procedures', completed: false, locked: false },
      { id: 'dept-2', title: 'Service Delivery Standards', description: 'Quality standards for citizen service', completed: false, locked: false },
      { id: 'dept-3', title: 'Documentation Requirements', description: 'Proper documentation practices', completed: false, locked: false },
    ],
  },
  {
    id: 'supervised',
    title: 'Supervised Tasks',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    skills: [
      { id: 'sup-1', title: 'Basic Service Tasks', description: 'Performing routine service tasks under supervision', completed: false, locked: true, requiresApproval: true },
      { id: 'sup-2', title: 'Customer Interaction', description: 'Handling citizen inquiries with supervisor present', completed: false, locked: true, requiresApproval: true },
      { id: 'sup-3', title: 'System Navigation', description: 'Using internal systems with guidance', completed: false, locked: true, requiresApproval: true },
    ],
  },
  {
    id: 'independent',
    title: 'Independent Execution',
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    skills: [
      { id: 'ind-1', title: 'Full Service Delivery', description: 'Complete service transactions independently', completed: false, locked: true, requiresApproval: true },
      { id: 'ind-2', title: 'Complex Problem Solving', description: 'Handle escalated issues autonomously', completed: false, locked: true, requiresApproval: true },
      { id: 'ind-3', title: 'Quality Assurance', description: 'Self-review and quality control', completed: false, locked: true, requiresApproval: true },
      { id: 'ind-4', title: 'Knowledge Sharing', description: 'Mentor junior staff and document learnings', completed: false, locked: true, requiresApproval: true },
    ],
  },
];

export default function LearningPage() {
  const { user, isSenior, isAdmin, isJunior } = useAuth();
  const { users } = useAppStore();
  const [activeTab, setActiveTab] = useState<'my-progress' | 'team-progress'>('my-progress');
  const [skills, setSkills] = useState(phases);
  const [selectedJunior, setSelectedJunior] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const juniorUsers = users.filter((u) => u.role === 'junior');

  const currentUserSkills = phases;

  const handleToggleSkill = (skillId: string) => {
    setSkills((prev) =>
      prev.map((phase) => ({
        ...phase,
        skills: phase.skills.map((skill) =>
          skill.id === skillId && !skill.locked
            ? { ...skill, completed: !skill.completed }
            : skill
        ),
      }))
    );
  };

  const handleApproveSkill = (userId: string, skillId: string) => {
    showToast(`Skill approved for ${users.find((u) => u.id === userId)?.name}!`, 'success');
  };

  const calculateProgress = () => {
    const totalSkills = skills.flatMap((s) => s.skills).length;
    const completedSkills = skills.flatMap((s) => s.skills).filter((sk) => sk.completed).length;
    return Math.round((completedSkills / totalSkills) * 100);
  };

  const progress = calculateProgress();

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Growth</h1>
            <p className="text-slate-500 mt-1">Track your career progression at A-Mesob Service Center</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Your Path to Senior Level</p>
              <h2 className="text-3xl font-bold mt-1">{progress}% Complete</h2>
              <p className="text-blue-100 mt-1">
                {skills.flatMap((s) => s.skills).filter((sk) => sk.completed).length} of{' '}
                {skills.flatMap((s) => s.skills).length} skills mastered
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{progress}%</div>
              <p className="text-blue-100 text-sm mt-1">Current Progress</p>
            </div>
          </div>
          <div className="mt-4 h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span>Self-service tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span>Requires supervisor approval</span>
            </div>
          </div>
        </div>

        {(isSenior || isAdmin) && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('my-progress')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'my-progress'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                My Progress
              </button>
              <button
                onClick={() => setActiveTab('team-progress')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'team-progress'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Team Progress ({juniorUsers.length} juniors)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'my-progress' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {skills.map((phase) => (
              <SkillPhase
                key={phase.id}
                title={phase.title}
                icon={phase.icon}
                color={phase.color}
                bgColor={phase.bgColor}
                skills={phase.skills}
                onToggleSkill={handleToggleSkill}
              />
            ))}
          </div>
        )}

        {activeTab === 'team-progress' && (isSenior || isAdmin) && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {juniorUsers.map((junior) => (
                <button
                  key={junior.id}
                  onClick={() => setSelectedJunior(selectedJunior === junior.id ? null : junior.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedJunior === junior.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white font-medium">
                      {junior.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{junior.name}</p>
                      <p className="text-sm text-slate-500">{junior.department}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedJunior && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Skills Awaiting Approval
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <p className="font-medium text-slate-800">Basic Service Tasks</p>
                      <p className="text-sm text-slate-500">Departmental Training - Phase 2</p>
                    </div>
                    <button
                      onClick={() => handleApproveSkill(selectedJunior, 'sup-1')}
                      className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <p className="font-medium text-slate-800">Customer Interaction</p>
                      <p className="text-sm text-slate-500">Supervised Tasks - Phase 3</p>
                    </div>
                    <button
                      onClick={() => handleApproveSkill(selectedJunior, 'sup-2')}
                      className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {toast && (
          <div
            className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-in ${
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {toast.type === 'success' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
              {toast.message}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
