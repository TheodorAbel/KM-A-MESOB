'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout';
import { SkillPhase } from '@/components/learning/SkillTree';
import { ShadowRequest, MentorshipNote } from '@/types';

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
      { id: 'hr-1', title: 'Company Culture & Values', description: 'Understanding A-Mesob mission and service principles', completed: true, locked: false },
      { id: 'hr-2', title: 'Code of Conduct', description: 'Professional behavior and ethics guidelines', completed: true, locked: false },
      { id: 'hr-3', title: 'Leave & Benefits Policy', description: 'Understanding employee benefits and leave procedures', completed: false, locked: false },
      { id: 'hr-4', title: 'IT Security Basics', description: 'Password security, data protection, and acceptable use', completed: true, locked: false },
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
      { id: 'dept-1', title: 'Ministry API Integration', description: 'Understanding government ministry APIs and integration patterns', completed: false, locked: false, canRequestShadow: true },
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
      { id: 'sup-1', title: 'Legacy Data Migration', description: 'Migrating data from legacy systems to modern APIs', completed: false, locked: true, requiresApproval: true, canRequestShadow: true },
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
      { id: 'ind-2', title: 'Complex Problem Solving', description: 'Handle escalated issues autonomously', completed: false, locked: true, requiresApproval: true, canRequestShadow: true },
      { id: 'ind-3', title: 'Quality Assurance', description: 'Self-review and quality control', completed: false, locked: true, requiresApproval: true },
      { id: 'ind-4', title: 'Knowledge Sharing', description: 'Mentor junior staff and document learnings', completed: false, locked: true, requiresApproval: true },
    ],
  },
];

function ShadowRequestModal({
  isOpen,
  onClose,
  skillId,
  skillName,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  skillId: string;
  skillName: string;
  onSubmit: (seniorId: string, date: string, time: string, message: string) => void;
}) {
  const { users } = useAppStore();
  const seniors = users.filter((u) => u.role === 'senior' || u.role === 'admin');
  const [selectedSenior, setSelectedSenior] = useState('');
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('14:00');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedSenior || !proposedDate) return;
    onSubmit(selectedSenior, proposedDate, proposedTime, message);
    setSelectedSenior('');
    setProposedDate('');
    setProposedTime('14:00');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">🙋</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Request Shadow Session</h2>
              <p className="text-sm text-slate-600">{skillName}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Mentor</label>
            <select
              value={selectedSenior}
              onChange={(e) => setSelectedSenior(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Choose a senior engineer...</option>
              {seniors.map((senior) => (
                <option key={senior.id} value={senior.id}>
                  {senior.name} - {senior.department}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proposed Date</label>
              <input
                type="date"
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input
                type="time"
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you'd like to learn or work on together..."
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedSenior || !proposedDate}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}

function MentorshipNotesModal({
  isOpen,
  onClose,
  junior,
  existingNotes,
  onAddNote,
}: {
  isOpen: boolean;
  onClose: () => void;
  junior: { id: string; name: string } | null;
  existingNotes: MentorshipNote[];
  onAddNote: (note: string, rating: number) => void;
}) {
  const [newNote, setNewNote] = useState('');
  const [rating, setRating] = useState(5);

  if (!isOpen || !junior) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Mentorship Notes</h2>
              <p className="text-sm text-slate-600">Feedback for {junior.name}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="font-semibold text-slate-800 mb-3">Previous Notes</h3>
          {existingNotes.length === 0 ? (
            <p className="text-slate-500 text-sm">No mentorship notes yet.</p>
          ) : (
            <div className="space-y-3 mb-6">
              {existingNotes.map((note) => (
                <div key={note.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700">{note.skillName}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= (note.rating || 0) ? 'text-amber-400' : 'text-slate-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{note.note}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <h3 className="font-semibold text-slate-800 mb-3">Add New Note</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-colors ${
                      star <= rating ? 'text-amber-400 hover:text-amber-500' : 'text-slate-300 hover:text-amber-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-sm text-slate-500 ml-2">
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Needs Improvement' : 'Poor'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Feedback Note</label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Share observations, areas of improvement, and strengths observed..."
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (newNote.trim()) {
                onAddNote(newNote, rating);
                setNewNote('');
                setRating(5);
              }
            }}
            disabled={!newNote.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LearningPage() {
  const { user, isSenior, isAdmin, isJunior } = useAuth();
  const { users, shadowRequests, mentorshipNotes, createShadowRequest, updateShadowRequestStatus, addMentorshipNote } = useAppStore();
  const [activeTab, setActiveTab] = useState<'my-progress' | 'team-progress'>('my-progress');
  const [skills, setSkills] = useState(phases);
  const [selectedJunior, setSelectedJunior] = useState<string | null>(null);
  const [showShadowModal, setShowShadowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<{ id: string; name: string } | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const juniorUsers = users.filter((u) => u.role === 'junior');
  const seniorUsers = users.filter((u) => u.role === 'senior' || u.role === 'admin');
  const currentUserPendingRequests = shadowRequests.filter(
    (req) => req.juniorId === user?.id && req.status === 'pending'
  );
  const myNotesForJuniors = mentorshipNotes.filter((note) => note.mentorId === user?.id);

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

  const handleRequestShadow = (skillId: string, skillName: string) => {
    setSelectedSkill({ id: skillId, name: skillName });
    setShowShadowModal(true);
  };

  const handleShadowSubmit = (seniorId: string, date: string, time: string, message: string) => {
    if (!user || !selectedSkill) return;
    createShadowRequest({
      juniorId: user.id,
      seniorId,
      skillId: selectedSkill.id,
      skillName: selectedSkill.name,
      proposedDate: date,
      proposedTime: time,
      message,
    });
    setShowShadowModal(false);
    setSelectedSkill(null);
    showToast('Shadow session request sent!', 'success');
  };

  const handleApproveShadow = (requestId: string) => {
    updateShadowRequestStatus(requestId, 'accepted');
    showToast('Shadow session accepted!', 'success');
  };

  const handleDeclineShadow = (requestId: string) => {
    updateShadowRequestStatus(requestId, 'declined');
    showToast('Shadow session declined', 'error');
  };

  const handleCompleteShadow = (requestId: string) => {
    updateShadowRequestStatus(requestId, 'completed');
    showToast('Shadow session marked as completed!', 'success');
  };

  const handleAddNote = (juniorId: string, note: string, rating: number) => {
    if (!user) return;
    const junior = users.find((u) => u.id === juniorId);
    if (!junior) return;
    const request = shadowRequests.find(
      (r) => r.juniorId === juniorId && r.status === 'completed'
    );
    addMentorshipNote({
      mentorId: user.id,
      menteeId: juniorId,
      skillId: request?.skillId || 'general',
      skillName: request?.skillName || 'General',
      note,
      rating,
    });
    showToast('Mentorship note saved!', 'success');
  };

  const calculateProgress = () => {
    const totalSkills = skills.flatMap((s) => s.skills).length;
    const completedSkills = skills.flatMap((s) => s.skills).filter((sk) => sk.completed).length;
    return Math.round((completedSkills / totalSkills) * 100);
  };

  const progress = calculateProgress();

  const selectedJuniorData = selectedJunior ? users.find((u) => u.id === selectedJunior) : null;
  const juniorPendingRequests = shadowRequests.filter(
    (req) => req.juniorId === selectedJunior && req.status === 'pending'
  );
  const juniorNotes = mentorshipNotes.filter((note) => note.menteeId === selectedJunior);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Growth</h1>
            <p className="text-slate-500 mt-1">Track your career progression at A-Mesob</p>
          </div>
        </div>

        {/* Progress Banner */}
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

          {currentUserPendingRequests.length > 0 && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <span>🙋</span>
                <span>{currentUserPendingRequests.length} shadow session request(s) pending</span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs for Seniors/Admins */}
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
          <div className="space-y-4">
            {skills.map((phase) => (
              <div key={phase.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className={`px-4 py-3 ${phase.bgColor} border-b border-slate-200`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${phase.color}`}>{phase.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">{phase.title}</h3>
                      <p className="text-sm text-slate-500">
                        {phase.skills.filter((s) => s.completed).length} of {phase.skills.length} completed
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {phase.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        skill.completed
                          ? 'bg-green-50 border-green-300'
                          : skill.locked
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            skill.completed
                              ? 'bg-green-500 border-green-500'
                              : skill.locked
                              ? 'bg-slate-200 border-slate-300'
                              : 'border-slate-300 cursor-pointer'
                          }`}
                          onClick={() => !skill.locked && handleToggleSkill(skill.id)}
                        >
                          {skill.completed && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {skill.locked && !skill.completed && (
                            <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 17a1 1 0 100-2 1 1 0 000 2zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 1110 0v2h1z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-slate-800">{skill.title}</h4>
                              <p className="text-sm text-slate-500 mt-1">{skill.description}</p>
                            </div>
                            {(skill as any).canRequestShadow && isJunior && !skill.completed && (
                              <button
                                onClick={() => handleRequestShadow(skill.id, skill.title)}
                                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1.5"
                              >
                                <span>🙋</span>
                                <span>Request Shadow</span>
                              </button>
                            )}
                          </div>
                          {skill.locked && (
                            <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                              Requires supervisor approval
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'team-progress' && (isSenior || isAdmin) && (
          <div className="space-y-6">
            {/* Pending Shadow Requests */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <span>🙋</span>
                  Pending Shadow Requests ({shadowRequests.filter((r) => r.status === 'pending' && seniorUsers.some((s) => s.id === r.seniorId)).length})
                </h3>
              </div>
              <div className="p-4">
                {shadowRequests.filter((r) => r.status === 'pending' && r.seniorId === user?.id).length === 0 ? (
                  <p className="text-slate-500 text-sm">No pending shadow requests for you.</p>
                ) : (
                  <div className="space-y-3">
                    {shadowRequests
                      .filter((r) => r.status === 'pending' && r.seniorId === user?.id)
                      .map((request) => {
                        const junior = users.find((u) => u.id === request.juniorId);
                        return (
                          <div key={request.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-slate-800">{junior?.name} requests shadow session</p>
                                <p className="text-sm text-slate-600">Skill: {request.skillName}</p>
                                <p className="text-sm text-slate-500">
                                  {request.proposedDate} at {request.proposedTime}
                                </p>
                                {request.message && (
                                  <p className="text-sm text-slate-500 mt-2 italic">"{request.message}"</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDeclineShadow(request.id)}
                                  className="px-3 py-1.5 text-red-600 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleApproveShadow(request.id)}
                                  className="px-3 py-1.5 text-green-600 bg-green-50 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                                >
                                  Accept
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Junior Team Members */}
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
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }} />
                    </div>
                    <span className="text-sm text-slate-500">65%</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Junior Details */}
            {selectedJuniorData && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    {selectedJuniorData.name}&apos;s Progress & Requests
                  </h3>
                  <button
                    onClick={() => setShowNotesModal(true)}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center gap-1.5"
                  >
                    <span>📝</span>
                    Add Mentorship Note
                  </button>
                </div>
                <div className="p-4">
                  {/* Completed Sessions */}
                  {shadowRequests.filter((r) => r.juniorId === selectedJunior && r.status === 'completed').length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-600 mb-2">Completed Shadow Sessions</h4>
                      <div className="space-y-2">
                        {shadowRequests
                          .filter((r) => r.juniorId === selectedJunior && r.status === 'completed')
                          .map((r) => (
                            <div key={r.id} className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                              <span>✓</span>
                              <span>{r.skillName}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Pending Requests */}
                  {juniorPendingRequests.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-2">Pending Requests</h4>
                      <div className="space-y-2">
                        {juniorPendingRequests.map((req) => (
                          <div key={req.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <div>
                              <p className="font-medium text-slate-800">{req.skillName}</p>
                              <p className="text-sm text-slate-500">{req.proposedDate} at {req.proposedTime}</p>
                            </div>
                            <button
                              onClick={() => handleCompleteShadow(req.id)}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                            >
                              Mark Complete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Mentorship Notes */}
                  {juniorNotes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-slate-600 mb-2">Recent Mentorship Notes</h4>
                      <div className="space-y-2">
                        {juniorNotes.slice(0, 3).map((note) => (
                          <div key={note.id} className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-slate-700 text-sm">{note.skillName}</span>
                              <span className="text-amber-400 text-sm">{'★'.repeat(note.rating || 0)}</span>
                            </div>
                            <p className="text-sm text-slate-600 line-clamp-2">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {juniorPendingRequests.length === 0 && juniorNotes.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-4">No activity yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        <ShadowRequestModal
          isOpen={showShadowModal}
          onClose={() => {
            setShowShadowModal(false);
            setSelectedSkill(null);
          }}
          skillId={selectedSkill?.id || ''}
          skillName={selectedSkill?.name || ''}
          onSubmit={handleShadowSubmit}
        />

        <MentorshipNotesModal
          isOpen={showNotesModal}
          onClose={() => setShowNotesModal(false)}
          junior={selectedJuniorData ? { id: selectedJuniorData.id, name: selectedJuniorData.name } : null}
          existingNotes={juniorNotes}
          onAddNote={(note, rating) => selectedJunior && handleAddNote(selectedJunior, note, rating)}
        />

        {/* Toast */}
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
