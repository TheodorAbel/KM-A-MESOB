'use client';

import { IssueTicket, IssueStatus } from '@/types';

interface IssueCardProps {
  ticket: IssueTicket;
  onClick: () => void;
  onStatusChange?: (newStatus: IssueStatus) => void;
  canModify?: boolean;
  showStatusChange?: boolean;
}

const priorityColors: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-amber-100 text-amber-700',
  Critical: 'bg-red-100 text-red-700',
};

export function IssueCard({ ticket, onClick, onStatusChange, canModify, showStatusChange }: IssueCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNextStatus = (): IssueStatus | null => {
    if (ticket.status === 'Open') return 'In Progress';
    if (ticket.status === 'In Progress') return 'Resolved';
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <div
      className={`bg-white rounded-lg border p-4 cursor-pointer hover:shadow-md transition-all group ${
        ticket.postMortemGenerated ? 'border-green-300 bg-green-50/30' : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[ticket.priority]}`}>
            {ticket.priority}
          </span>
          {ticket.postMortemGenerated && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
              📋 Post-Mortem
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">{formatDate(ticket.createdAt)}</span>
      </div>
      
      <h4 className="font-medium text-slate-800 group-hover:text-blue-600 line-clamp-2">
        {ticket.title}
      </h4>
      
      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{ticket.description}</p>
      
      <div className="flex items-center gap-2 mt-3">
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
          {ticket.category}
        </span>
        {ticket.rootCause && (
          <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs" title={ticket.rootCause}>
            🔍 Root cause identified
          </span>
        )}
      </div>

      {/* Status Change Actions */}
      {showStatusChange && nextStatus && onStatusChange && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(nextStatus);
            }}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
              nextStatus === 'Resolved'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {nextStatus === 'In Progress' ? '→ Start Working' : '✓ Mark Resolved'}
          </button>
          {nextStatus === 'Resolved' && (ticket.priority === 'Critical' || ticket.priority === 'High') && (
            <p className="text-xs text-slate-500 text-center mt-1">
              Post-mortem form will appear
            </p>
          )}
        </div>
      )}
    </div>
  );
}
