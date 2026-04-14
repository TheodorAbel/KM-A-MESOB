'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { InsightType } from '@/types';

interface CreatePostProps {
  onPostCreated: () => void;
}

const postTypes: { type: InsightType; label: string; shortLabel: string; color: string; bgColor: string }[] = [
  { type: 'Insight', label: 'Insight', shortLabel: '💡', color: 'text-green-700', bgColor: 'bg-green-100' },
  { type: 'Challenge', label: 'Challenge', shortLabel: '⚠️', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  { type: 'Lesson Learned', label: 'Lesson', shortLabel: '📘', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { type: 'Question', label: 'Question', shortLabel: '❓', color: 'text-slate-700', bgColor: 'bg-slate-100' },
];

const languages = [
  { value: 'typescript', label: 'TS' },
  { value: 'javascript', label: 'JS' },
  { value: 'python', label: 'Python' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'sql', label: 'SQL' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'other', label: 'Other' },
];

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { addInsightPost, currentUser } = useAppStore();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<InsightType>('Question');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('typescript');

  const handleSubmit = () => {
    if (!content.trim() || !title.trim() || !currentUser) return;

    addInsightPost({
      authorId: currentUser.id,
      content: content.trim(),
      title: title.trim(),
      type: selectedType,
      codeSnippet: codeSnippet.trim() || undefined,
      language: codeSnippet.trim() ? language : undefined,
    });

    setContent('');
    setTitle('');
    setSelectedType('Question');
    setCodeSnippet('');
    setLanguage('typescript');
    setIsExpanded(false);
    onPostCreated();
  };

  const initials = user?.name.split(' ').map((n) => n[0]).join('') || '??';

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-xs sm:text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Ask or share..."
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all text-sm"
            />
            
            {isExpanded && (
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 animate-in">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe your question or insight..."
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                />

                {/* Code Snippet Section */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span className="hidden sm:inline">Code Snippet (optional)</span>
                    <span className="sm:hidden">Code</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="px-2 sm:px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                      ))}
                    </select>
                    <div className="col-span-2 sm:col-span-3">
                      <input
                        type="text"
                        value={codeSnippet}
                        onChange={(e) => setCodeSnippet(e.target.value)}
                        placeholder="Paste code..."
                        className="w-full px-3 py-2 bg-slate-900 text-slate-100 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Post Type</p>
                  <div className="flex flex-wrap gap-2">
                    {postTypes.map((pt) => (
                      <button
                        key={pt.type}
                        onClick={() => setSelectedType(pt.type)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                          selectedType === pt.type
                            ? `${pt.bgColor} ${pt.color} ring-2 ring-offset-1 ring-slate-300`
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span className="sm:hidden">{pt.shortLabel}</span>
                        <span className="hidden sm:inline">{pt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      setContent('');
                      setTitle('');
                      setCodeSnippet('');
                    }}
                    className="px-3 sm:px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!title.trim() || !content.trim()}
                    className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
