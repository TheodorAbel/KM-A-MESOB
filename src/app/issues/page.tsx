'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout';
import { IssueCard } from '@/components/issues/IssueCard';
import { TicketDetailModal } from '@/components/issues/TicketDetailModal';
import { PostMortemModal, PostMortemData } from '@/components/issues/PostMortemModal';
import { IssueStatus, IssueTicket, IssuePriority } from '@/types';

const columns: { id: IssueStatus; label: string; color: string }[] = [
  { id: 'Open', label: 'Open', color: 'bg-red-500' },
  { id: 'In Progress', label: 'In Progress', color: 'bg-amber-500' },
  { id: 'Resolved', label: 'Resolved', color: 'bg-green-500' },
];

const categories = [
  { value: 'Integration', label: 'Integration' },
  { value: 'FinTech', label: 'FinTech' },
  { value: 'Infrastructure', label: 'Infrastructure' },
  { value: 'Security', label: 'Security' },
  { value: 'Database', label: 'Database' },
  { value: 'API', label: 'API' },
];

const priorities: IssuePriority[] = ['Critical', 'High', 'Medium', 'Low'];

export default function IssuesPage() {
  const { issueTickets, addIssueTicket, updateTicketStatus, addArticle, currentUser } = useAppStore();
  const { isSenior, isAdmin } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<IssueTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [showPostMortem, setShowPostMortem] = useState(false);
  const [ticketToResolve, setTicketToResolve] = useState<IssueTicket | null>(null);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'Integration',
    priority: 'Medium' as IssuePriority,
  });

  const canModify = isSenior || isAdmin;

  const ticketsByStatus = useMemo(() => {
    const grouped: Record<IssueStatus, IssueTicket[]> = {
      'Open': [],
      'In Progress': [],
      'Resolved': [],
      'Closed': [],
    };
    issueTickets.forEach((ticket) => {
      if (grouped[ticket.status]) {
        grouped[ticket.status].push(ticket);
      }
    });
    return grouped;
  }, [issueTickets]);

  const handleOpenTicket = (ticket: IssueTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleStatusChange = (ticket: IssueTicket, newStatus: IssueStatus) => {
    if (!canModify) return;

    if ((ticket.priority === 'Critical' || ticket.priority === 'High') && newStatus === 'Resolved') {
      setTicketToResolve(ticket);
      setShowPostMortem(true);
    } else {
      updateTicketStatus(ticket.id, newStatus);
    }
  };

  const handlePostMortemSubmit = (postMortem: PostMortemData) => {
    if (!ticketToResolve || !currentUser) return;

    const resolutionNotes = `Root Cause: ${postMortem.rootCause}\n\nDiagnostic Steps: ${postMortem.diagnosticSteps}\n\nFix Applied: ${postMortem.fixApplied}`;

    updateTicketStatus(
      ticketToResolve.id,
      'Resolved',
      resolutionNotes,
      postMortem.rootCause,
      postMortem.diagnosticSteps
    );

    const kbArticleContent = `# Incident Post-Mortem: ${ticketToResolve.title}

## Summary
${ticketToResolve.description}

## Impact
- **Priority:** ${ticketToResolve.priority}
- **Category:** ${ticketToResolve.category}
- **Duration:** (document time from first alert to resolution)

## Root Cause
${postMortem.rootCause}

## Diagnostic Steps Taken
${postMortem.diagnosticSteps}

## Resolution
${postMortem.fixApplied}

## Preventative Measures
- [ ] Add monitoring alert for this pattern
- [ ] Add unit test to prevent regression
- [ ] Update runbook documentation

## Timeline
- **Reported:** ${new Date(ticketToResolve.createdAt).toLocaleString()}
- **Resolved:** ${new Date().toLocaleString()}

---
*This post-mortem was automatically generated from the Issue Logs system.*`;

    addArticle({
      title: `Post-Mortem: ${ticketToResolve.title}`,
      content: kbArticleContent,
      category: 'Digital Infrastructure',
      authorId: currentUser.id,
      tags: ['post-mortem', 'incident', ticketToResolve.category.toLowerCase(), ticketToResolve.priority.toLowerCase()],
      status: 'draft',
    });

    setShowPostMortem(false);
    setTicketToResolve(null);
  };

  const handleCreateTicket = () => {
    if (!newTicket.title.trim() || !newTicket.description.trim() || !currentUser) return;

    addIssueTicket({
      title: newTicket.title.trim(),
      description: newTicket.description.trim(),
      status: 'Open',
      priority: newTicket.priority,
      category: newTicket.category,
      reportedById: currentUser.id,
    });

    setNewTicket({ title: '', description: '', category: 'Integration', priority: 'Medium' });
    setShowNewTicketForm(false);
  };

  const openCount = ticketsByStatus['Open'].length;
  const criticalCount = ticketsByStatus['Open'].filter(t => t.priority === 'Critical').length;
  const highCount = ticketsByStatus['Open'].filter(t => t.priority === 'High').length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span>🐛</span>
              Incident Management
            </h1>
            <p className="text-slate-500 mt-1">
              Track and resolve technical incidents with post-mortem documentation
            </p>
          </div>
          <button
            onClick={() => setShowNewTicketForm(!showNewTicketForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Incident
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
            <span className="text-lg">📋</span>
            <span className="text-sm text-slate-600">{openCount} Open Incidents</span>
          </div>
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg border border-red-200">
              <span className="text-lg">🔴</span>
              <span className="text-sm text-red-700 font-medium">{criticalCount} Critical</span>
            </div>
          )}
          {highCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg border border-amber-200">
              <span className="text-lg">🟠</span>
              <span className="text-sm text-amber-700 font-medium">{highCount} High Priority</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
            <span className="text-lg">✅</span>
            <span className="text-sm text-slate-600">
              {ticketsByStatus['Resolved'].filter(t => t.postMortemGenerated).length} Post-Mortems
            </span>
          </div>
        </div>

        {/* New Ticket Form */}
        {showNewTicketForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Report New Incident</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Brief description of the incident..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Detailed description including affected services, error messages, user impact..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as IssuePriority })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewTicketForm(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  disabled={!newTicket.title.trim() || !newTicket.description.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  Submit Incident
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-slate-800">{column.label}</h3>
                <span className="ml-auto px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                  {ticketsByStatus[column.id]?.length || 0}
                </span>
              </div>
              <div className="flex-1 space-y-3 min-h-[500px] bg-slate-50 rounded-xl p-3">
                {ticketsByStatus[column.id]?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
                    <span className="text-2xl mb-2">✓</span>
                    <span>No incidents</span>
                  </div>
                ) : (
                  ticketsByStatus[column.id]?.map((ticket) => (
                    <IssueCard
                      key={ticket.id}
                      ticket={ticket}
                      onClick={() => handleOpenTicket(ticket)}
                      onStatusChange={(newStatus) => handleStatusChange(ticket, newStatus)}
                      canModify={canModify}
                      showStatusChange={canModify && ticket.status !== 'Resolved'}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Detail Modal */}
        <TicketDetailModal
          ticket={selectedTicket}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTicket(null);
          }}
        />

        {/* Post-Mortem Modal */}
        <PostMortemModal
          ticket={ticketToResolve}
          isOpen={showPostMortem}
          onClose={() => {
            setShowPostMortem(false);
            setTicketToResolve(null);
          }}
          onSubmit={handlePostMortemSubmit}
        />
      </div>
    </AppShell>
  );
}
