'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/layout';
import { CreatePost } from '@/components/community/CreatePost';
import { InsightCard } from '@/components/community/InsightCard';
import { InsightType } from '@/types';

type FilterType = 'All' | InsightType;

const filters: { type: FilterType; label: string; emoji: string; color: string }[] = [
  { type: 'All', label: 'All Posts', emoji: '📋', color: 'bg-slate-100 text-slate-700' },
  { type: 'Insight', label: 'Insights', emoji: '💡', color: 'bg-green-100 text-green-700' },
  { type: 'Challenge', label: 'Challenges', emoji: '⚠️', color: 'bg-amber-100 text-amber-700' },
  { type: 'Lesson Learned', label: 'Lessons', emoji: '📘', color: 'bg-blue-100 text-blue-700' },
  { type: 'Question', label: 'Questions', emoji: '❓', color: 'bg-purple-100 text-purple-700' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'votes', label: 'Most Votes' },
  { value: 'unanswered', label: 'Unanswered' },
];

export default function CommunityPage() {
  const { insightPosts } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [sortBy, setSortBy] = useState('newest');
  const [refreshKey, setRefreshKey] = useState(0);

  const filteredPosts = useMemo(() => {
    let posts = [...insightPosts];
    
    if (activeFilter !== 'All') {
      posts = posts.filter((p) => p.type === activeFilter);
    }
    
    if (sortBy === 'newest') {
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'votes') {
      posts.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'unanswered') {
      posts = posts.filter((p) => p.comments.length === 0);
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return posts;
  }, [insightPosts, activeFilter, sortBy, refreshKey]);

  const handlePostCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  const questionCount = insightPosts.filter((p) => p.type === 'Question').length;
  const answeredCount = insightPosts.filter((p) => p.type === 'Question' && p.verifiedCommentId).length;
  const insightCount = insightPosts.filter((p) => p.type === 'Insight' || p.type === 'Challenge' || p.type === 'Lesson Learned').length;

  return (
    <AppShell>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span>💬</span>
              <span className="hidden sm:inline">Solutions & Snippets Hub</span>
              <span className="sm:hidden">Community</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Technical Q&A, insights, and code snippets
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-slate-200">
            <span className="text-sm sm:text-lg">❓</span>
            <span className="text-xs sm:text-sm text-slate-600">{questionCount} Qs</span>
            <span className="hidden sm:inline px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              {answeredCount} answered
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-slate-200">
            <span className="text-sm sm:text-lg">💡</span>
            <span className="text-xs sm:text-sm text-slate-600">{insightCount} Insights</span>
          </div>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-lg border border-slate-200">
            <span className="text-sm sm:text-lg">📝</span>
            <span className="text-xs sm:text-sm text-slate-600">{insightPosts.reduce((acc, p) => acc + p.comments.length, 0)} Answers</span>
          </div>
        </div>

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-white rounded-xl border border-slate-200 p-3 sm:p-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300">
            {filters.map((filter) => (
              <button
                key={filter.type}
                onClick={() => setActiveFilter(filter.type)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.type
                    ? filter.color + ' ring-2 ring-offset-1 ring-slate-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter.emoji} <span className="hidden sm:inline">{filter.label}</span>
                <span className="sm:hidden">{filter.type === 'All' ? 'All' : filter.type === 'Lesson Learned' ? 'Lesson' : filter.type}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs sm:text-sm text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 sm:px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-base sm:text-lg font-medium text-slate-700">No posts found</p>
              <p className="text-slate-500 mt-1 text-sm">Be the first to {activeFilter === 'Question' ? 'ask a question' : 'share an insight'}!</p>
            </div>
          ) : (
            <>
              <div className="text-xs sm:text-sm text-slate-500">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
              </div>
              {filteredPosts.map((post) => (
                <InsightCard key={post.id} post={post} />
              ))}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
