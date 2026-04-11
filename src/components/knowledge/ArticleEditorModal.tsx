'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useAppStore } from '@/lib/store';
import { ArticleCategory } from '@/types';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialContent?: string;
  initialCategory?: ArticleCategory;
}

const categories: ArticleCategory[] = ['Government Integrations', 'FinTech & Payment Gateways', 'Digital Infrastructure'];

export function ArticleEditorModal({ 
  isOpen, 
  onClose, 
  initialTitle = '', 
  initialContent = '',
  initialCategory = 'Government Integrations' 
}: ArticleEditorModalProps) {
  const { addArticle, currentUser } = useAppStore();
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState<ArticleCategory>(initialCategory);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your article content here...',
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  useEffect(() => {
    setTitle(initialTitle);
    setCategory(initialCategory);
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialTitle, initialContent, initialCategory, editor]);

  const handleSubmit = () => {
    if (!title.trim() || !editor || !currentUser) return;

    addArticle({
      title: title.trim(),
      content: editor.getHTML(),
      category,
      authorId: currentUser.id,
      tags: tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      status,
    });

    setTitle('');
    setCategory('Government Integrations');
    setTags('');
    setStatus('published');
    editor.commands.clearContent();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            {initialTitle ? 'Create Article from Resolution' : 'Create New Article'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., troubleshooting, resolution, IT"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
                <button
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-2 rounded hover:bg-slate-200 ${editor?.isActive('bold') ? 'bg-slate-200' : ''}`}
                >
                  <span className="font-bold text-sm">B</span>
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded hover:bg-slate-200 ${editor?.isActive('italic') ? 'bg-slate-200' : ''}`}
                >
                  <span className="italic text-sm">I</span>
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded hover:bg-slate-200 ${editor?.isActive('heading', { level: 2 }) ? 'bg-slate-200' : ''}`}
                >
                  <span className="font-bold text-sm">H2</span>
                </button>
                <button
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded hover:bg-slate-200 ${editor?.isActive('bulletList') ? 'bg-slate-200' : ''}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <EditorContent editor={editor} className="min-h-[200px]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'draft' ? 'Save as Draft' : 'Publish Article'}
          </button>
        </div>
      </div>
    </div>
  );
}
