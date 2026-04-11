'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

function ArticleCard({ article, onClick }: { article: KnowledgeArticle; onClick: () => void }) {
  const { users } = useAppStore();
  const author = users.find((u) => u.id === article.authorId);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${article.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
          {article.status}
        </span>
        <span className="text-xs text-slate-400">{article.views} views</span>
      </div>
      <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{article.content.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-medium">
            {author?.avatar || author?.name?.charAt(0) || '?'}
          </div>
          <span className="text-xs text-slate-500">{author?.name || 'Unknown'}</span>
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
  const { users } = useAppStore();
  const author = users.find((u) => u.id === article.authorId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${article.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
              {article.category}
            </span>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{article.title}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-sm font-medium">
                  {author?.avatar || author?.name?.charAt(0) || '?'}
                </div>
                <span>{author?.name || 'Unknown'}</span>
              </div>
              <span>•</span>
              <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{article.views} views</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          {article.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
      </div>
    </div>
  );
}

function KnowledgeBaseContent() {
  const searchParams = useSearchParams();
  const { articles } = useAppStore();
  const { isSenior, isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>(
    (searchParams.get('category') as ArticleCategory) || 'all'
  );
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const canCreate = isSenior || isAdmin;

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.some((c) => c.id === category)) {
      setSelectedCategory(category as ArticleCategory);
    } else if (!category) {
      setSelectedCategory('all');
    }
  }, [searchParams]);

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
    setSelectedCategory(category);
    setSelectedArticle(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              📚 Knowledge Base
            </h1>
            <p className="text-slate-500 mt-1">
              Technical documentation for government integrations and payment systems
            </p>
          </div>
          {canCreate && (
            <button
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Article
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

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
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

            {!canCreate && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">ℹ️</span>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Read-Only Access</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Contact your supervisor to contribute articles.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-12 lg:col-span-9">
            {selectedArticle ? (
              <div className="h-[calc(100vh-280px)]">
                <ArticleViewer article={selectedArticle} onClose={() => setSelectedArticle(null)} />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {selectedCategory === 'all' ? 'All Articles' : selectedCategory}
                    <span className="text-slate-400 font-normal ml-2">({filteredArticles.length})</span>
                  </h2>
                </div>
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onClick={() => setSelectedArticle(article)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl">📄</span>
                    </div>
                    <h3 className="text-lg font-medium text-slate-700 mb-1">No articles found</h3>
                    <p className="text-slate-500">
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
