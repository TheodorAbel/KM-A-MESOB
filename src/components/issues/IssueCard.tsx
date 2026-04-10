'use client';

import { IssueTicket } from '@/types';

interface IssueCardProps {
  ticket: IssueTicket;
  onClick: () => void;
}

const priorityColors: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-amber-100 text-amber-700',
  Critical: 'bg-red-100 text-red-700',
};

export function IssueCard({ ticket, onClick }: IssueCardProps) {
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

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-slate-200 p-4 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </span>
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
      </div>
    </div>
  );
}
