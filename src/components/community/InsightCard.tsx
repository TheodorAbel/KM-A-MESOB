'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { InsightPost } from '@/types';

interface InsightCardProps {
  post: InsightPost;
}

const typeStyles: Record<string, { bg: string; text: string; label: string; border: string }> = {
  Insight: { bg: 'bg-green-50', text: 'text-green-700', label: 'Insight', border: 'border-green-200' },
  Challenge: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Challenge', border: 'border-amber-200' },
  'Lesson Learned': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Lesson', border: 'border-blue-200' },
  Question: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Question', border: 'border-purple-200' },
};

const languageColors: Record<string, string> = {
  typescript: 'text-blue-400',
  javascript: 'text-yellow-400',
  python: 'text-green-400',
  bash: 'text-slate-400',
  json: 'text-orange-400',
  yaml: 'text-pink-400',
  sql: 'text-cyan-400',
  go: 'text-cyan-300',
  java: 'text-red-400',
};

export function InsightCard({ post }: InsightCardProps) {
  const { users, toggleUpvote, addComment, currentUser, verifyComment } = useAppStore();
  const { isAdmin } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const author = users.find((u) => u.id === post.authorId);
  const authorInitials = author?.name.split(' ').map((n) => n[0]).join('') || '??';
  const style = typeStyles[post.type] || typeStyles.Question;
  const canVerify = isAdmin;
  const isQuestion = post.type === 'Question';

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
    setShowCommentInput(false);
  };

  const handleVerifyComment = (commentId: string) => {
    verifyComment(post.id, commentId);
  };

  const sortedComments = [...post.comments].sort((a, b) => {
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className={`bg-white rounded-xl border ${post.isVerifiedSolution ? 'border-green-300' : 'border-slate-200'} overflow-hidden hover:shadow-md transition-shadow`}>
      {post.isVerifiedSolution && (
        <div className="bg-green-50 border-b border-green-200 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2">
          <span className="text-base sm:text-lg">✅</span>
          <span className="text-xs sm:text-sm font-medium text-green-700">Verified Solution</span>
        </div>
      )}

      <div className="p-3 sm:p-4 flex gap-2 sm:gap-4">
        {/* Left Sidebar - Stats - Hidden on mobile, shown inline in footer */}
        <div className="hidden sm:flex flex-col items-center gap-2 w-14 shrink-0">
          <button
            onClick={handleUpvote}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
              post.hasUpvoted
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <svg
              className={`w-5 h-5 ${post.hasUpvoted ? 'fill-current' : ''}`}
              fill={post.hasUpvoted ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span className="font-bold text-sm">{post.upvotes}</span>
          </button>

          {isQuestion && (
            <div className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              post.verifiedCommentId ? 'bg-green-50' : 'bg-slate-50'
            }`}>
              <span className={`text-lg ${post.verifiedCommentId ? 'text-green-600' : 'text-slate-400'}`}>
                {post.verifiedCommentId ? '✓' : '○'}
              </span>
              <span className={`font-bold text-sm ${post.verifiedCommentId ? 'text-green-600' : 'text-slate-400'}`}>
                {post.comments.length}
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
                  {style.label}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 hover:text-blue-600 cursor-pointer line-clamp-2">
                {post.title}
              </h3>
              <p className="text-slate-600 mt-2 text-sm whitespace-pre-wrap line-clamp-3 sm:line-clamp-none">{post.content}</p>

              {/* Code Snippet */}
              {post.codeSnippet && (
                <div className="mt-3 sm:mt-4 rounded-lg overflow-hidden border border-slate-700">
                  <div className="bg-slate-800 px-3 py-1.5 flex items-center justify-between">
                    <span className={`text-xs font-medium ${languageColors[post.language || 'other'] || 'text-slate-400'}`}>
                      {post.language?.toUpperCase() || 'CODE'}
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline">snippet</span>
                  </div>
                  <pre className="bg-slate-900 p-3 sm:p-4 overflow-x-auto max-h-48 sm:max-h-none">
                    <code className="text-xs sm:text-sm text-slate-100 font-mono whitespace-pre">{post.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 sm:mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {/* Mobile: inline upvotes */}
              <div className="flex items-center gap-1 sm:hidden">
                <button
                  onClick={handleUpvote}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                    post.hasUpvoted
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-500 bg-slate-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill={post.hasUpvoted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {post.upvotes}
                </button>
              </div>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                {authorInitials}
              </div>
              <span className="text-xs sm:text-sm text-slate-600 hidden sm:inline">{author?.name || 'Unknown'}</span>
              <span className="text-xs text-slate-400">{formatTime(post.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowComments(!showComments);
                  setShowCommentInput(false);
                }}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {post.comments.length} {post.comments.length === 1 ? 'ans' : 'answers'}
              </button>
              <button
                onClick={() => setShowCommentInput(!showCommentInput)}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <div className="px-4 pb-4">
          <div className="ml-20 bg-slate-50 rounded-lg p-4 border border-slate-200">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your answer..."
              rows={3}
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
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Post Answer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {showComments && sortedComments.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50">
          <div className="p-4 space-y-3">
            {sortedComments.map((comment) => {
              const commentAuthor = users.find((u) => u.id === comment.authorId);
              const isVerified = comment.isVerified;

              return (
                <div
                  key={comment.id}
                  className={`flex gap-3 p-3 rounded-lg bg-white ${
                    isVerified ? 'border-2 border-green-400' : 'border border-slate-200'
                  }`}
                >
                  {/* Vote + Verify */}
                  <div className="flex flex-col items-center gap-1 w-12 shrink-0">
                    {isVerified && (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                        ✓
                      </div>
                    )}
                    {canVerify && isQuestion && !post.verifiedCommentId && (
                      <button
                        onClick={() => handleVerifyComment(comment.id)}
                        className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-green-400 hover:text-green-500 transition-colors"
                        title="Mark as verified solution"
                      >
                        ✓
                      </button>
                    )}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white text-xs font-medium">
                        {commentAuthor?.name.split(' ').map((n) => n[0]).join('') || '??'}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{commentAuthor?.name || 'Unknown'}</span>
                      {isVerified && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          ✓ Verified Solution
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{formatTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{comment.content}</p>
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
