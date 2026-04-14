'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout';
import { ArticleEditorModal } from '@/components/knowledge/ArticleEditorModal';
import { ArticleCategory, KnowledgeArticle } from '@/types';

const categories: { id: ArticleCategory; label: string; icon: string; color: string }[] = [
  { id: 'Government Integrations', label: 'Government Integrations', icon: '🏛️', color: 'bg-purple-500' },
  { id: 'FinTech & Payment Gateways', label: 'FinTech & Payments', icon: '💳', color: 'bg-green-500' },
  { id: 'Digital Infrastructure', label: 'Digital Infrastructure', icon: '⚙️', color: 'bg-blue-500' },
];

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'warning'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg text-white animate-in slide-in-from-bottom-4 ${
      type === 'success' ? 'bg-green-600' : 'bg-amber-600'
    }`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xl sm:text-2xl">{type === 'success' ? '✅' : '🚩'}</span>
        <p className="font-medium text-sm sm:text-base flex-1">{message}</p>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ArticleCard({ article, onClick }: { article: KnowledgeArticle; onClick: () => void }) {
  const { users } = useAppStore();
  const author = users.find((u) => u.id === article.authorId);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-3 sm:p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className="flex gap-2">
          {article.needsVerification ? (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
              ⚠️ Verification
            </span>
          ) : (
            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium ${article.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
              {article.status}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">{article.views} views</span>
      </div>
      <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base">
        {article.title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 line-clamp-2">{article.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-medium">
            {author?.avatar || author?.name?.charAt(0) || '?'}
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">{author?.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {article.likes}
          </span>
        </div>
      </div>
    </div>
  );
}

function ArticleViewer({ article, onClose }: { article: KnowledgeArticle; onClose: () => void }) {
  const { users, flagArticle, clearFlagArticle } = useAppStore();
  const { user, isSenior, isAdmin } = useAuth();
  const author = users.find((u) => u.id === article.authorId);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const canEdit = isSenior || isAdmin;

  const handleFlag = () => {
    if (!user) return;
    flagArticle(article.id, user.id);
    setToast({
      message: `Alert sent to Author: Tacit practice differs from this formal document.`,
      type: 'warning'
    });
  };

  const handleResolveFlag = () => {
    clearFlagArticle(article.id);
    setIsEditorOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
        <div className="p-3 sm:p-6 border-b border-slate-200">
          {/* Verification Banner */}
          {article.needsVerification && (
            <div className="mb-4 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xl sm:text-2xl">🚩</span>
                <div className="flex-1">
                  <p className="font-semibold text-amber-800 text-sm sm:text-base">Reality Check Flagged</p>
                  <p className="text-xs sm:text-sm text-amber-700">
                    Flagged by {users.find(u => u.id === article.flaggedBy)?.name || 'Unknown'}
                  </p>
                </div>
                {canEdit && (
                  <button
                    onClick={handleResolveFlag}
                    className="px-3 sm:px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors text-sm"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium ${
                  article.needsVerification ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  article.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                }`}>
                  {article.needsVerification ? '⚠️ Verification' : article.category.split(' ')[0]}
                </span>
                {!canEdit && !article.needsVerification && (
                  <button
                    onClick={handleFlag}
                    className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 rounded-full hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all flex items-center gap-1"
                  >
                    <span>🚩</span>
                    <span className="hidden sm:inline">Flag: Outdated</span>
                    <span className="sm:hidden">Flag</span>
                  </button>
                )}
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-800 mb-2">{article.title}</h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                    {author?.avatar || author?.name?.charAt(0) || '?'}
                  </div>
                  <span className="hidden sm:inline">{author?.name || 'Unknown'}</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                <span className="hidden sm:inline">•</span>
                <span>{article.views} views</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg ml-2">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-4 overflow-x-auto pb-1">
            {article.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs whitespace-nowrap">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="prose prose-slate max-w-none text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
        </div>
      </div>

      {isEditorOpen && (
        <ArticleEditorModal
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            onClose();
          }}
          initialTitle={article.title}
          initialContent={article.content}
          initialCategory={article.category}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

function KnowledgeBaseContent() {
  const searchParams = useSearchParams();
  const { articles } = useAppStore();
  const { isSenior, isAdmin } = useAuth();
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const canCreate = isSenior || isAdmin;
  const rawCategory = searchParams.get('category');
  const selectedCategory: ArticleCategory | 'all' = rawCategory 
    ? (rawCategory as ArticleCategory)
    : 'all';
  const router = useRouter();

  const articleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.filter((a) => a.status !== 'draft').forEach((article) => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    return counts;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    let result = articles.filter((a) => a.status !== 'draft');
    
    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [articles, selectedCategory, searchQuery]);

  const handleCategorySelect = (category: ArticleCategory | 'all') => {
    if (category === 'all') {
      router.push('/knowledge-base');
    } else {
      router.push(`/knowledge-base?category=${encodeURIComponent(category)}`);
    }
    setSelectedArticle(null);
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              📚 <span className="hidden sm:inline">Knowledge Base</span>
            </h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">
              Technical documentation for government integrations
            </p>
          </div>
          {canCreate && (
            <button
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="sm:hidden">New</span>
              <span className="hidden sm:inline">Create Article</span>
            </button>
          )}
        </div>

        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, content, or tags..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Mobile: Horizontal category tabs */}
          <div className="lg:hidden -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                All ({articles.filter((a) => a.status !== 'draft').length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat.icon} {cat.label.split(' ')[0]} ({articleCounts[cat.id] || 0})
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Sidebar categories */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 sticky top-20">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <span>📂</span> Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Articles</span>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                    {articles.filter((a) => a.status !== 'draft').length}
                  </span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                      {articleCounts[cat.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Flagged Articles Filter */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚩</span>
                <div>
                  <p className="text-sm font-medium text-amber-800">Needs Verification</p>
                  <p className="text-xs text-amber-700">
                    {articles.filter((a) => a.needsVerification).length} articles flagged
                  </p>
                </div>
              </div>
            </div>

            {!canCreate && (
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">ℹ️</span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Read-Only Access</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Flag articles if practices differ from documentation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-9">
            {selectedArticle ? (
              <div className="h-[calc(100vh-200px)] lg:h-[calc(100vh-280px)]">
                <ArticleViewer 
                  article={selectedArticle} 
                  onClose={() => setSelectedArticle(null)} 
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-800">
                    {selectedCategory === 'all' ? 'All Articles' : selectedCategory}
                    <span className="text-slate-400 font-normal ml-2">({filteredArticles.length})</span>
                  </h2>
                </div>
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {filteredArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onClick={() => setSelectedArticle(article)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-12 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl sm:text-3xl">📄</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-slate-700 mb-1">No articles found</h3>
                    <p className="text-slate-500 text-sm">
                      {searchQuery ? 'Try a different search term' : 'No articles in this category yet'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ArticleEditorModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
    </>
  );
}

export default function KnowledgeBasePage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <KnowledgeBaseContent />
      </Suspense>
    </AppShell>
  );
}
