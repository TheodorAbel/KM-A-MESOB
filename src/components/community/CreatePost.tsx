'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { InsightType } from '@/types';

interface CreatePostProps {
  onPostCreated: () => void;
}

const postTypes: { type: InsightType; label: string; color: string; bgColor: string }[] = [
  { type: 'Insight', label: '💡 Insight', color: 'text-green-700', bgColor: 'bg-green-100' },
  { type: 'Challenge', label: '⚠️ Challenge', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  { type: 'Lesson Learned', label: '📘 Lesson Learned', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { type: 'Question', label: '❓ Question', color: 'text-slate-700', bgColor: 'bg-slate-100' },
];

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { addInsightPost, currentUser } = useAppStore();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<InsightType>('Insight');

  const handleSubmit = () => {
    if (!content.trim() || !title.trim() || !currentUser) return;

    addInsightPost({
      authorId: currentUser.id,
      content: content.trim(),
      title: title.trim(),
      type: selectedType,
    });

    setContent('');
    setTitle('');
    setSelectedType('Insight');
    setIsExpanded(false);
    onPostCreated();
  };

  const initials = user?.name.split(' ').map((n) => n[0]).join('') || '??';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Share an insight, challenge, or lesson learned..."
              className="w-full px-4 py-2.5 bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all"
            />
            
            {isExpanded && (
              <div className="mt-4 space-y-4 animate-in">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe your insight in detail..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />

                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Post Type (required)</p>
                  <div className="flex flex-wrap gap-2">
                    {postTypes.map((pt) => (
                      <button
                        key={pt.type}
                        onClick={() => setSelectedType(pt.type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedType === pt.type
                            ? `${pt.bgColor} ${pt.color} ring-2 ring-offset-1 ring-slate-300`
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      setContent('');
                      setTitle('');
                    }}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!title.trim() || !content.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
