'use client';

import { useState } from 'react';
import { IssueTicket } from '@/types';

interface PostMortemModalProps {
  ticket: IssueTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postMortem: PostMortemData) => void;
}

export interface PostMortemData {
  rootCause: string;
  diagnosticSteps: string;
  fixApplied: string;
}

export function PostMortemModal({ ticket, isOpen, onClose, onSubmit }: PostMortemModalProps) {
  const [rootCause, setRootCause] = useState('');
  const [diagnosticSteps, setDiagnosticSteps] = useState('');
  const [fixApplied, setFixApplied] = useState('');

  if (!isOpen || !ticket) return null;

  const handleSubmit = () => {
    if (!rootCause.trim() || !diagnosticSteps.trim() || !fixApplied.trim()) return;
    
    onSubmit({
      rootCause: rootCause.trim(),
      diagnosticSteps: diagnosticSteps.trim(),
      fixApplied: fixApplied.trim(),
    });

    setRootCause('');
    setDiagnosticSteps('');
    setFixApplied('');
  };

  const isValid = rootCause.trim() && diagnosticSteps.trim() && fixApplied.trim();

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center sm:items-start sm:pt-4 sm:pb-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full h-full sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:max-w-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-gradient-to-r from-red-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-slate-800">Post-Mortem Required</h2>
              <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">Complete this form to resolve the ticket</p>
            </div>
          </div>
        </div>

        {/* Ticket Summary */}
        <div className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-xs font-medium ${
              ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {ticket.priority}
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm text-slate-600 font-medium truncate">{ticket.title}</span>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Root Cause Analysis */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
              <span className="text-red-500">*</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Root Cause Analysis</span>
              <span className="sm:hidden">Root Cause</span>
            </label>
            <textarea
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="Describe the technical root cause..."
              rows={3}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
            />
          </div>

          {/* Diagnostic Steps */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
              <span className="text-red-500">*</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="hidden sm:inline">Diagnostic Steps</span>
              <span className="sm:hidden">Steps</span>
            </label>
            <textarea
              value={diagnosticSteps}
              onChange={(e) => setDiagnosticSteps(e.target.value)}
              placeholder="Document troubleshooting steps..."
              rows={3}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
            />
          </div>

          {/* Fix Applied */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
              <span className="text-red-500">*</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="hidden sm:inline">Fix Applied</span>
              <span className="sm:hidden">Fix</span>
            </label>
            <textarea
              value={fixApplied}
              onChange={(e) => setFixApplied(e.target.value)}
              placeholder="Paste code changes, config updates..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm font-mono text-slate-100"
            />
          </div>

          {/* Auto-generate KB Article Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-800">Knowledge Conversion</p>
                <p className="text-xs text-blue-700 mt-1 hidden sm:block">
                  Submitting will mark this ticket as Resolved and create a Draft article in the Knowledge Base.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="hidden sm:inline">Submit & Resolve</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
