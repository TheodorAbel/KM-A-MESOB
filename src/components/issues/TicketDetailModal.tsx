'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { IssueTicket } from '@/types';
import { ArticleEditorModal } from '@/components/knowledge/ArticleEditorModal';

interface TicketDetailModalProps {
  ticket: IssueTicket | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Open: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'In Progress': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Resolved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  Closed: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

const priorityColors: Record<string, { bg: string; text: string }> = {
  Low: { bg: 'bg-slate-100', text: 'text-slate-600' },
  Medium: { bg: 'bg-blue-100', text: 'text-blue-700' },
  High: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Critical: { bg: 'bg-red-100', text: 'text-red-700' },
};

export function TicketDetailModal({ ticket, isOpen, onClose }: TicketDetailModalProps) {
  const { users, updateTicketStatus } = useAppStore();
  const { isSenior, isAdmin } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [showArticleEditor, setShowArticleEditor] = useState(false);
  const [comments, setComments] = useState<{ id: string; author: string; text: string; date: string }[]>([
    { id: '1', author: 'Frehiwot Worku', text: 'Investigating the root cause. Appears to be related to server timeout settings.', date: '2025-04-21' },
    { id: '2', author: 'Daniel Kebede', text: 'Customer reported 5 instances this morning. Escalating priority.', date: '2025-04-21' },
  ]);

  if (!isOpen || !ticket) return null;

  const reporter = users.find((u) => u.id === ticket.reportedById);
  const assignee = ticket.assignedToId ? users.find((u) => u.id === ticket.assignedToId) : null;
  const status = statusColors[ticket.status];
  const priority = priorityColors[ticket.priority];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { id: Date.now().toString(), author: 'Current User', text: newComment, date: new Date().toISOString() },
    ]);
    setNewComment('');
  };

  const handleConvertToArticle = () => {
    setShowArticleEditor(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text} border ${status.border}`}>
                {ticket.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority.bg} ${priority.text}`}>
                {ticket.priority}
              </span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-slate-800">{ticket.title}</h2>
            
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
              <div>
                <span className="text-slate-400">Reported by:</span>{' '}
                <span className="font-medium">{reporter?.name || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-slate-400">Category:</span>{' '}
                <span className="font-medium">{ticket.category}</span>
              </div>
              {assignee && (
                <div>
                  <span className="text-slate-400">Assigned to:</span>{' '}
                  <span className="font-medium">{assignee.name}</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Description</h3>
              <div className="bg-slate-50 rounded-lg p-4 text-slate-700">
                {ticket.description}
              </div>
            </div>

            {ticket.resolutionNotes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Resolution Notes</h3>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-slate-700">
                  {ticket.resolutionNotes}
                </div>
              </div>
            )}

            {ticket.status === 'Resolved' && (isSenior || isAdmin) && (
              <div className="mt-6">
                <button
                  onClick={handleConvertToArticle}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span className="text-xl">✨</span>
                  <span>Convert to Knowledge Base Article</span>
                </button>
                <p className="text-xs text-slate-500 text-center mt-2">
                  This will open the article editor with the resolution notes pre-filled
                </p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Activity & Comments</h3>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                      {comment.author.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-slate-800">{comment.author}</span>
                        <span className="text-xs text-slate-400">{comment.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                  ME
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Created: {formatDate(ticket.createdAt)}</span>
              <span>Updated: {formatDate(ticket.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <ArticleEditorModal
        isOpen={showArticleEditor}
        onClose={() => setShowArticleEditor(false)}
        initialContent={ticket.resolutionNotes || `## Issue Summary\n${ticket.description}\n\n## Resolution\n\n`}
        initialTitle={`KB-${ticket.id}: ${ticket.title}`}
        initialCategory="IT Procedures"
      />
    </>
  );
}
