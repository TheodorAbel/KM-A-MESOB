'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { InsightPost } from '@/types';

interface InsightCardProps {
  post: InsightPost;
}

const typeStyles: Record<string, { bg: string; text: string; label: string }> = {
  Insight: { bg: 'bg-green-100', text: 'text-green-700', label: '💡 Insight' },
  Challenge: { bg: 'bg-amber-100', text: 'text-amber-700', label: '⚠️ Challenge' },
  'Lesson Learned': { bg: 'bg-blue-100', text: 'text-blue-700', label: '📘 Lesson Learned' },
  Question: { bg: 'bg-slate-100', text: 'text-slate-700', label: '❓ Question' },
};

export function InsightCard({ post }: InsightCardProps) {
  const { users, toggleUpvote, addComment, currentUser } = useAppStore();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const author = users.find((u) => u.id === post.authorId);
  const authorInitials = author?.name.split(' ').map((n) => n[0]).join('') || '??';
  const style = typeStyles[post.type] || typeStyles.Question;

  const formatTime = (dateStr: string) => {
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

  const handleUpvote = () => {
    toggleUpvote(post.id);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment(post.id, newComment.trim());
    setNewComment('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-medium shrink-0">
            {authorInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-slate-800">{author?.name || 'Unknown'}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                {style.label}
              </span>
              <span className="text-slate-400 text-sm">•</span>
              <span className="text-slate-400 text-sm">{formatTime(post.createdAt)}</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mt-1">{post.title}</h3>
            <p className="text-slate-600 mt-2 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-4">
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
            post.hasUpvoted
              ? 'bg-blue-100 text-blue-700'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <svg
            className={`w-5 h-5 ${post.hasUpvoted ? 'fill-current' : ''}`}
            fill={post.hasUpvoted ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          <span className="font-medium">{post.upvotes}</span>
          <span className="text-sm">upvotes</span>
        </button>

        <button
          onClick={() => {
            setShowComments(!showComments);
            setShowCommentInput(false);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="font-medium">{post.comments.length}</span>
          <span className="text-sm">comments</span>
        </button>

        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-all ml-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          <span className="text-sm">Reply</span>
        </button>
      </div>

      {showCommentInput && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
              {currentUser?.name.split(' ').map((n) => n[0]).join('') || '??'}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setShowCommentInput(false);
                    setNewComment('');
                  }}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showComments && post.comments.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-sm font-medium text-slate-700 mb-3">Comments</p>
          <div className="space-y-3">
            {post.comments.map((comment) => {
              const commentAuthor = users.find((u) => u.id === comment.authorId);
              return (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                    {commentAuthor?.name.split(' ').map((n) => n[0]).join('') || '??'}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg px-3 py-2 border border-slate-200">
                      <p className="text-sm font-medium text-slate-800">{commentAuthor?.name || 'Unknown'}</p>
                      <p className="text-sm text-slate-600 mt-1">{comment.content}</p>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 ml-1">{formatTime(comment.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
