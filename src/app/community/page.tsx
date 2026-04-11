'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/layout';
import { CreatePost } from '@/components/community/CreatePost';
import { InsightCard } from '@/components/community/InsightCard';
import { InsightType } from '@/types';

type FilterType = 'All' | InsightType;

const filters: { type: FilterType; label: string; emoji: string }[] = [
  { type: 'All', label: 'All Posts', emoji: '📋' },
  { type: 'Insight', label: 'Insights', emoji: '💡' },
  { type: 'Challenge', label: 'Challenges', emoji: '⚠️' },
  { type: 'Lesson Learned', label: 'Lessons', emoji: '📘' },
  { type: 'Question', label: 'Questions', emoji: '❓' },
];

export default function CommunityPage() {
  const { insightPosts } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [refreshKey, setRefreshKey] = useState(0);

  const filteredPosts = useMemo(() => {
    let posts = [...insightPosts];
    if (activeFilter !== 'All') {
      posts = posts.filter((p) => p.type === activeFilter);
    }
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [insightPosts, activeFilter, refreshKey]);

  const handlePostCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">Community Board</h1>
          <p className="text-slate-500 mt-1">
            Share insights, challenges, and lessons learned with your team
          </p>
        </div>

        <CreatePost onPostCreated={handlePostCreated} />

        <div className="bg-white rounded-xl border border-slate-200 p-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter.type}
                onClick={() => setActiveFilter(filter.type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.type
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filter.emoji} {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-700">No posts yet</p>
              <p className="text-slate-500 mt-1">Be the first to share an insight!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <InsightCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
