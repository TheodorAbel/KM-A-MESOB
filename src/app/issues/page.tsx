'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout';
import { IssueCard } from '@/components/issues/IssueCard';
import { TicketDetailModal } from '@/components/issues/TicketDetailModal';
import { IssueStatus, IssueTicket } from '@/types';

const columns: { id: IssueStatus; label: string; color: string }[] = [
  { id: 'Open', label: 'New Incident', color: 'bg-red-500' },
  { id: 'In Progress', label: 'In Progress', color: 'bg-amber-500' },
  { id: 'Resolved', label: 'Resolved', color: 'bg-green-500' },
];

export default function IssuesPage() {
  const { issueTickets, addIssueTicket, currentUser } = useAppStore();
  const { isSenior, isAdmin } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<IssueTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'IT',
    priority: 'Medium' as const,
  });

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

    setNewTicket({ title: '', description: '', category: 'IT', priority: 'Medium' });
    setShowNewTicketForm(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Issue Logs</h1>
            <p className="text-slate-500 mt-1">
              Track and resolve issues to maintain service quality
            </p>
          </div>
          <button
            onClick={() => setShowNewTicketForm(!showNewTicketForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Issue
          </button>
        </div>

        {showNewTicketForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Report New Issue</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Brief description of the issue..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Detailed description of the issue..."
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
                    <option value="IT">IT</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Process">Process</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
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
                  Submit Issue
                </button>
              </div>
            </div>
          </div>
        )}

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
              <div className="flex-1 space-y-3 min-h-[400px] bg-slate-50 rounded-xl p-3">
                {ticketsByStatus[column.id]?.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                    No issues
                  </div>
                ) : (
                  ticketsByStatus[column.id]?.map((ticket) => (
                    <IssueCard
                      key={ticket.id}
                      ticket={ticket}
                      onClick={() => handleOpenTicket(ticket)}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <TicketDetailModal
          ticket={selectedTicket}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTicket(null);
          }}
        />
      </div>
    </AppShell>
  );
}
