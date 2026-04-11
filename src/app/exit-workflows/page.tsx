'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout';
import { OffboardingRecord, Department } from '@/types';

type WizardStep = 'experience' | 'assets' | 'walkthrough' | 'review';

const departments: Department[] = ['Integration', 'DevOps', 'Security', 'Product', 'Finance', 'Quality Assurance'];

function RecordCard({ record }: { record: OffboardingRecord }) {
  const { users } = useAppStore();
  const interviewer = users.find(u => u.id === record.interviewerId);

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-800">{record.employeeName}</h3>
            <p className="text-sm text-slate-500">{record.department} Department</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[record.knowledgeTransferStatus]}`}>
            {record.knowledgeTransferStatus === 'in-progress' ? 'In Progress' : 
             record.knowledgeTransferStatus.charAt(0).toUpperCase() + record.knowledgeTransferStatus.slice(1)}
          </span>
        </div>

        {/* Digital Assets */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Digital Assets</p>
          <div className="flex flex-wrap gap-2">
            {record.digitalAssetsOwned.slice(0, 3).map((asset, i) => (
              <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                {asset}
              </span>
            ))}
            {record.digitalAssetsOwned.length > 3 && (
              <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs">
                +{record.digitalAssetsOwned.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Key Contacts */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Key Contacts Handover</p>
          <div className="space-y-1">
            {record.keyContacts.slice(0, 2).map((contact, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="text-slate-600">{contact.name}</span>
                <span className="text-slate-400">- {contact.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <span>Last Day: {formatDate(record.lastWorkingDay)}</span>
          <span>•</span>
          <span>Interview: {formatDate(record.interviewDate)}</span>
          {record.walkthroughVideoUrl && (
            <>
              <span>•</span>
              <a href={record.walkthroughVideoUrl} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline flex items-center gap-1">
                <span>🎥</span> Walkthrough
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function HandoverWizard({ onComplete }: { onComplete: () => void }) {
  const { addOffboardingRecord, currentUser } = useAppStore();
  const [step, setStep] = useState<WizardStep>('experience');
  const [formData, setFormData] = useState({
    employeeName: '',
    department: 'Integration' as Department,
    lastWorkingDay: '',
    interviewDate: new Date().toISOString().split('T')[0],
    unwrittenRules: '',
    institutionalKnowledge: '',
    keyContacts: [{ name: '', role: '', email: '', phone: '', notes: '' }],
    digitalAssets: [''],
    walkthroughUrl: '',
    processMapUrl: '',
    exitNotes: '',
  });

  const steps: { id: WizardStep; label: string; icon: string }[] = [
    { id: 'experience', label: 'Experience', icon: '💡' },
    { id: 'assets', label: 'Digital Assets', icon: '🔐' },
    { id: 'walkthrough', label: 'Walkthrough', icon: '🎥' },
    { id: 'review', label: 'Review', icon: '📋' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  const addKeyContact = () => {
    setFormData(prev => ({
      ...prev,
      keyContacts: [...prev.keyContacts, { name: '', role: '', email: '', phone: '', notes: '' }]
    }));
  };

  const removeKeyContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyContacts: prev.keyContacts.filter((_, i) => i !== index)
    }));
  };

  const updateKeyContact = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      keyContacts: prev.keyContacts.map((c, i) => i === index ? { ...c, [field]: value } : c)
    }));
  };

  const addDigitalAsset = () => {
    setFormData(prev => ({
      ...prev,
      digitalAssets: [...prev.digitalAssets, '']
    }));
  };

  const removeDigitalAsset = (index: number) => {
    setFormData(prev => ({
      ...prev,
      digitalAssets: prev.digitalAssets.filter((_, i) => i !== index)
    }));
  };

  const updateDigitalAsset = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      digitalAssets: prev.digitalAssets.map((a, i) => i === index ? value : a)
    }));
  };

  const handleSubmit = () => {
    if (!currentUser) return;

    addOffboardingRecord({
      employeeId: `emp-${Date.now()}`,
      employeeName: formData.employeeName,
      department: formData.department,
      lastWorkingDay: formData.lastWorkingDay,
      interviewDate: formData.interviewDate,
      interviewerId: currentUser.id,
      unwrittenRules: formData.unwrittenRules,
      institutionalKnowledge: formData.institutionalKnowledge,
      keyContacts: formData.keyContacts.filter(c => c.name && c.role),
      digitalAssetsOwned: formData.digitalAssets.filter(a => a.trim()),
      walkthroughVideoUrl: formData.walkthroughUrl || undefined,
      processMapUrl: formData.processMapUrl || undefined,
      knowledgeTransferStatus: 'pending',
      exitInterviewNotes: formData.exitNotes,
    });

    onComplete();
  };

  const renderStepContent = () => {
    switch (step) {
      case 'experience':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-blue-800">Experience Documentation</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Document tacit knowledge, unwritten rules, and institutional practices that aren't in official documentation.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                  placeholder="Full name"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value as Department }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Working Day</label>
                <input
                  type="date"
                  value={formData.lastWorkingDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastWorkingDay: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interview Date</label>
                <input
                  type="date"
                  value={formData.interviewDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, interviewDate: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Unwritten Rules & Conventions
              </label>
              <textarea
                value={formData.unwrittenRules}
                onChange={(e) => setFormData(prev => ({ ...prev, unwrittenRules: e.target.value }))}
                placeholder="Document informal practices, tribal knowledge, and conventions that new team members should know..."
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Institutional Knowledge
              </label>
              <textarea
                value={formData.institutionalKnowledge}
                onChange={(e) => setFormData(prev => ({ ...prev, institutionalKnowledge: e.target.value }))}
                placeholder="Document critical processes, known issues, vendor relationships, and organizational context..."
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        );

      case 'assets':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <p className="font-semibold text-purple-800">Digital Asset Ownership</p>
                  <p className="text-sm text-purple-700 mt-1">
                    List all digital systems, credentials, and technical assets this person maintains or owns.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Digital Assets Owned
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Examples: API credentials, server access, third-party service accounts, domain registrations
              </p>
              <div className="space-y-2">
                {formData.digitalAssets.map((asset, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={asset}
                      onChange={(e) => updateDigitalAsset(index, e.target.value)}
                      placeholder="e.g., AWS Production Console Access, Telebirr API Keys, Datadog Admin"
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                    />
                    {formData.digitalAssets.length > 1 && (
                      <button
                        onClick={() => removeDigitalAsset(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addDigitalAsset}
                className="mt-3 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg border border-dashed border-purple-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Digital Asset
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Key Contacts</label>
              <p className="text-xs text-slate-500 mb-3">
                Document important stakeholders, vendors, and team members this person works with
              </p>
              <div className="space-y-4">
                {formData.keyContacts.map((contact, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-700">Contact {index + 1}</span>
                      {formData.keyContacts.length > 1 && (
                        <button
                          onClick={() => removeKeyContact(index)}
                          className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => updateKeyContact(index, 'name', e.target.value)}
                        placeholder="Name"
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                      <input
                        type="text"
                        value={contact.role}
                        onChange={(e) => updateKeyContact(index, 'role', e.target.value)}
                        placeholder="Role/Title"
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateKeyContact(index, 'email', e.target.value)}
                        placeholder="Email"
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => updateKeyContact(index, 'phone', e.target.value)}
                        placeholder="Phone (optional)"
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      value={contact.notes}
                      onChange={(e) => updateKeyContact(index, 'notes', e.target.value)}
                      placeholder="Notes (e.g., 'Primary contact for X issue')"
                      className="w-full mt-3 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={addKeyContact}
                className="mt-3 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg border border-dashed border-purple-300 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Key Contact
              </button>
            </div>
          </div>
        );

      case 'walkthrough':
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎥</span>
                <div>
                  <p className="font-semibold text-amber-800">Video Walkthrough</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Record a screen share walking through local dev environment, deployment scripts, and critical workflows.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Loom / Video Walkthrough URL
              </label>
              <input
                type="url"
                value={formData.walkthroughUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, walkthroughUrl: e.target.value }))}
                placeholder="https://www.loom.com/share/..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Please provide a link to a screen recording walking through your local dev environment and deployment scripts.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Process Documentation URL
              </label>
              <input
                type="url"
                value={formData.processMapUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, processMapUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Exit Interview Notes
              </label>
              <textarea
                value={formData.exitNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, exitNotes: e.target.value }))}
                placeholder="Additional notes from the exit interview..."
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold text-green-800">Review & Submit</p>
                  <p className="text-sm text-green-700 mt-1">
                    Review the technical brief before submitting for knowledge transfer.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-white font-mono text-sm">
              <h4 className="text-lg font-bold text-green-400 mb-4">TECHNICAL BRIEF</h4>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-32 text-slate-400">Employee:</span>
                  <span>{formData.employeeName || '(Not set)'}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-400">Department:</span>
                  <span>{formData.department}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-slate-400">Last Day:</span>
                  <span>{formData.lastWorkingDay || '(Not set)'}</span>
                </div>
                <div className="border-t border-slate-700 pt-3 mt-3">
                  <span className="text-slate-400">Digital Assets ({formData.digitalAssets.filter(a => a.trim()).length}):</span>
                  <ul className="mt-2 space-y-1 pl-4">
                    {formData.digitalAssets.filter(a => a.trim()).map((asset, i) => (
                      <li key={i} className="text-green-300">• {asset}</li>
                    ))}
                    {formData.digitalAssets.filter(a => a.trim()).length === 0 && (
                      <li className="text-slate-500">(None specified)</li>
                    )}
                  </ul>
                </div>
                <div className="border-t border-slate-700 pt-3 mt-3">
                  <span className="text-slate-400">Key Contacts ({formData.keyContacts.filter(c => c.name).length}):</span>
                  <ul className="mt-2 space-y-1 pl-4">
                    {formData.keyContacts.filter(c => c.name).map((contact, i) => (
                      <li key={i} className="text-green-300">• {contact.name} - {contact.role}</li>
                    ))}
                    {formData.keyContacts.filter(c => c.name).length === 0 && (
                      <li className="text-slate-500">(None specified)</li>
                    )}
                  </ul>
                </div>
                {formData.walkthroughUrl && (
                  <div className="border-t border-slate-700 pt-3 mt-3">
                    <span className="text-slate-400">Video:</span>
                    <span className="text-blue-300 ml-2">{formData.walkthroughUrl}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Step Indicator */}
      <div className="border-b border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= currentStepIndex ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i < currentStepIndex ? 'bg-green-500 text-white' :
                  i === currentStepIndex ? 'bg-blue-500 text-white' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {i < currentStepIndex ? '✓' : s.icon}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 sm:w-24 h-0.5 mx-2 ${i < currentStepIndex ? 'bg-green-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderStepContent()}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <button
          onClick={() => {
            const prevIndex = currentStepIndex - 1;
            if (prevIndex >= 0) setStep(steps[prevIndex].id);
          }}
          disabled={currentStepIndex === 0}
          className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        {currentStepIndex < steps.length - 1 ? (
          <button
            onClick={() => setStep(steps[currentStepIndex + 1].id)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submit Handover
          </button>
        )}
      </div>
    </div>
  );
}

export default function ExitWorkflowsPage() {
  const { offboardingRecords, updateOffboardingStatus } = useAppStore();
  const { isAdmin } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = offboardingRecords.filter(record =>
    record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.digitalAssetsOwned.some(asset => asset.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleWizardComplete = () => {
    setShowWizard(false);
  };

  const pendingCount = offboardingRecords.filter(r => r.knowledgeTransferStatus === 'pending').length;
  const inProgressCount = offboardingRecords.filter(r => r.knowledgeTransferStatus === 'in-progress').length;
  const completedCount = offboardingRecords.filter(r => r.knowledgeTransferStatus === 'completed').length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span>🔄</span>
              Architecture Handover
            </h1>
            <p className="text-slate-500 mt-1">
              Technical knowledge transfer for departing engineers and system ownership
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowWizard(!showWizard)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Handover
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <span className="text-xl">📁</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{offboardingRecords.length}</p>
                <p className="text-sm text-slate-500">Total Records</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <span className="text-xl">⏳</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                <p className="text-sm text-slate-500">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">🔄</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
                <p className="text-sm text-slate-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                <p className="text-sm text-slate-500">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
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
            placeholder="Search by employee name, department, or digital asset..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Wizard */}
        {showWizard && (
          <HandoverWizard onComplete={handleWizardComplete} />
        )}

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🔄</span>
            </div>
            <p className="text-lg font-medium text-slate-700">No handover records found</p>
            <p className="text-slate-500 mt-1">
              {searchQuery ? 'Try adjusting your search' : 'Create a new handover to get started'}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
