'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout';
import { QMSFeedback } from '@/types';

const sourceIcons: Record<string, string> = {
  'E-Passport Portal': '📘',
  'Telebirr Gateway': '💳',
  'Ministry of Revenue e-Tax': '📋',
  'Digital ID Portal': '🪪',
  'Kebele ID Verification': '🏛️',
  'Business Registration Portal': '🏢',
  'Immigration Services': '✈️',
};

function CreateKnowledgeGapModal({ 
  feedback, 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  feedback: QMSFeedback | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; category: string; priority: string }) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Process');
  const [priority, setPriority] = useState('Medium');

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    onSubmit({ title, description, category, priority });
    setTitle('');
    setDescription('');
    setCategory('Process');
    setPriority('Medium');
  };

  if (!isOpen || !feedback) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Create Knowledge Gap Ticket</h2>
              <p className="text-sm text-slate-600">Bridge citizen feedback to internal documentation</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Citizen Feedback Context */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{sourceIcons[feedback.source] || '📋'}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">{feedback.source}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    feedback.citizenFailureRate >= 30 ? 'bg-red-100 text-red-700' :
                    feedback.citizenFailureRate >= 15 ? 'bg-amber-100 text-amber-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {feedback.citizenFailureRate}% failure rate
                  </span>
                  {feedback.knowledgeGapTicketId && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      Ticket: {feedback.knowledgeGapTicketId}
                    </span>
                  )}
                </div>
                <p className="text-sm text-amber-700 mt-2">{feedback.issueDescription}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ticket Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Improve E-Passport photo upload UX"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Technical Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Document the knowledge gap and proposed solution..."
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="Process">Process</option>
                  <option value="UX">User Experience</option>
                  <option value="Documentation">Documentation</option>
                  <option value="API">API Integration</option>
                  <option value="Training">Training Material</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Impact Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Impact Bridge</p>
                <p className="text-xs text-blue-700 mt-1">
                  This ticket will link citizen-experienced failures to internal engineering work, closing the feedback loop between public-facing issues and documentation improvements.
                </p>
              </div>
            </div>
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
            disabled={!title.trim() || !description.trim()}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QMSFeedbackPage() {
  const { qmsFeedback, addIssueTicket, currentUser } = useAppStore();
  const { isSenior, isAdmin } = useAuth();
  const [selectedFeedback, setSelectedFeedback] = useState<QMSFeedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterSource, setFilterSource] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'failureRate' | 'date'>('failureRate');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const canCreateTicket = isSenior || isAdmin;

  const uniqueSources = useMemo(() => {
    const sources = new Set(qmsFeedback.map(f => f.source));
    return ['All', ...Array.from(sources)];
  }, [qmsFeedback]);

  const sortedFeedback = useMemo(() => {
    let sorted = [...qmsFeedback];
    
    if (filterSource !== 'All') {
      sorted = sorted.filter(f => f.source === filterSource);
    }
    
    if (sortBy === 'failureRate') {
      sorted.sort((a, b) => b.citizenFailureRate - a.citizenFailureRate);
    } else {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return sorted;
  }, [qmsFeedback, filterSource, sortBy]);

  const handleCreateTicket = (data: { title: string; description: string; category: string; priority: string }) => {
    if (!selectedFeedback || !currentUser) return;

    addIssueTicket({
      title: `[Knowledge Gap] ${data.title}`,
      description: `Source: ${selectedFeedback.source}\nCitizen Failure Rate: ${selectedFeedback.citizenFailureRate}%\n\nOriginal Feedback:\n${selectedFeedback.issueDescription}\n\nTechnical Solution:\n${data.description}`,
      status: 'Open',
      priority: data.priority as any,
      category: data.category,
      reportedById: currentUser.id,
    });

    setIsModalOpen(false);
    setSelectedFeedback(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFailureRateColor = (rate: number) => {
    if (rate >= 30) return 'bg-red-100 text-red-700 border-red-200';
    if (rate >= 15) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const avgFailureRate = qmsFeedback.length > 0 
    ? (qmsFeedback.reduce((acc, f) => acc + f.citizenFailureRate, 0) / qmsFeedback.length).toFixed(1)
    : '0';

  const criticalCount = qmsFeedback.filter(f => f.citizenFailureRate >= 30).length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span>📊</span>
              Citizen Impact & QMS Feedback
            </h1>
            <p className="text-slate-500 mt-1">
              Bridging citizen experience feedback to internal knowledge gaps
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{qmsFeedback.length}</p>
                <p className="text-sm text-slate-500">Total Feedback</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                <p className="text-sm text-slate-500">Critical Issues</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <span className="text-xl">📈</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{avgFailureRate}%</p>
                <p className="text-sm text-slate-500">Avg Failure Rate</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {qmsFeedback.filter(f => f.knowledgeGapTicketId).length}
                </p>
                <p className="text-sm text-slate-500">Tickets Created</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Source:</span>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              {uniqueSources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'failureRate' | 'date')}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="failureRate">Failure Rate</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Source Portal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Failure Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Issue Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  {canCreateTicket && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedFeedback.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{sourceIcons[feedback.source] || '📋'}</span>
                        <span className="font-medium text-slate-800">{feedback.source}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getFailureRateColor(feedback.citizenFailureRate)}`}>
                        {feedback.citizenFailureRate}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-600 max-w-md line-clamp-2">{feedback.issueDescription}</p>
                    </td>
                    <td className="px-4 py-4">
                      {feedback.knowledgeGapTicketId ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          ✓ Ticket Created
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-500">{formatDate(feedback.createdAt)}</span>
                    </td>
                    {canCreateTicket && (
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedFeedback(feedback);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Create Ticket
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedFeedback.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📭</span>
              </div>
              <p className="text-lg font-medium text-slate-700">No feedback found</p>
              <p className="text-slate-500 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Role Notice */}
        {!canCreateTicket && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-slate-600">
              Only Senior and Admin users can create Knowledge Gap Tickets from feedback items.
            </p>
          </div>
        )}

        {/* Create Ticket Modal */}
        <CreateKnowledgeGapModal
          feedback={selectedFeedback}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFeedback(null);
          }}
          onSubmit={handleCreateTicket}
        />

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed bottom-6 right-6 px-6 py-4 bg-green-600 text-white rounded-xl shadow-lg animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">✅</span>
              <p className="font-medium">Knowledge Gap Ticket created successfully!</p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
