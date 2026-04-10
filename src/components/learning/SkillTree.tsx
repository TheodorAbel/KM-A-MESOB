'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';

interface SkillNodeProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
  onToggle: () => void;
}

export function SkillNode({ id, title, description, completed, locked, onToggle }: SkillNodeProps) {
  return (
    <div
      className={`relative p-4 rounded-lg border-2 transition-all ${
        completed
          ? 'bg-green-50 border-green-300'
          : locked
            ? 'bg-slate-50 border-slate-200 opacity-60'
            : 'bg-white border-slate-200 hover:border-blue-300 cursor-pointer'
      }`}
      onClick={() => !locked && onToggle()}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
            completed
              ? 'bg-green-500 border-green-500'
              : locked
                ? 'bg-slate-200 border-slate-300'
                : 'border-slate-300'
          }`}
        >
          {completed && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {locked && !completed && (
            <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17a1 1 0 100-2 1 1 0 000 2zm6-9a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h1V6a5 5 0 1110 0v2h1zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3z" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-slate-800">{title}</h4>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
          {locked && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
              Requires approval
            </span>
          )}
        </div>
        {!locked && (
          <span className={`text-xs font-medium ${completed ? 'text-green-600' : 'text-slate-400'}`}>
            {completed ? 'Completed' : 'Click to complete'}
          </span>
        )}
      </div>
    </div>
  );
}

interface SkillPhaseProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  skills: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    locked: boolean;
    requiresApproval?: boolean;
  }[];
  onToggleSkill: (id: string) => void;
  onApproveSkill?: (userId: string, skillId: string) => void;
  userId?: string;
}

export function SkillPhase({ title, icon, color, bgColor, skills, onToggleSkill, onApproveSkill, userId }: SkillPhaseProps) {
  const completedCount = skills.filter((s) => s.completed).length;
  const totalCount = skills.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className={`px-4 py-3 ${bgColor} border-b border-slate-200`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500">{completedCount} of {totalCount} completed</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-slate-800">{progress}%</span>
          </div>
        </div>
        <div className="mt-3 h-2 bg-white/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${progress === 100 ? 'bg-green-500' : color}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="p-4 space-y-3">
        {skills.map((skill) => (
          <div key={skill.id}>
            <SkillNode
              id={skill.id}
              title={skill.title}
              description={skill.description}
              completed={skill.completed}
              locked={skill.locked}
              onToggle={() => onToggleSkill(skill.id)}
            />
            {skill.locked && skill.completed && onApproveSkill && (
              <button
                onClick={() => onApproveSkill(userId!, skill.id)}
                className="mt-2 ml-9 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve Skill
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
