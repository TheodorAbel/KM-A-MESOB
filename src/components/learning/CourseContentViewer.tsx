'use client';

import { useState } from 'react';
import { QuizComponent, quizData } from './QuizComponent';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'reading' | 'exercise' | 'quiz';
  content: string;
}

interface LearningPathway {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  totalHours: string;
  moduleCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  modules: LearningModule[];
}

interface CourseContentViewerProps {
  pathway: LearningPathway;
  currentModuleIndex: number;
  completedModules: number[];
  onModuleComplete: (moduleId: string) => void;
  onBack: () => void;
}

export function CourseContentViewer({
  pathway,
  currentModuleIndex,
  completedModules,
  onModuleComplete,
  onBack,
}: CourseContentViewerProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'overview'>('content');
  const [notes, setNotes] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentModule = pathway.modules[currentModuleIndex];
  const isQuiz = currentModule.type === 'quiz';

  const getModuleStatus = (index: number) => {
    if (completedModules.includes(index)) return 'completed';
    if (index === currentModuleIndex) return 'current';
    const previousCompleted = completedModules.includes(index - 1) || (index === 0 && completedModules.length === 0);
    if (completedModules.length >= index) return 'available';
    return 'locked';
  };

  const handleQuizComplete = (passed: boolean, score: number) => {
    if (passed) {
      onModuleComplete(currentModule.id);
    }
  };

  const isCurrentCompleted = completedModules.includes(currentModuleIndex);
  const canAccessModule = (index: number) => {
    if (index === 0) return true;
    return completedModules.includes(index - 1) || completedModules.length >= index;
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="flex h-[calc(100vh-64px)]">
        {sidebarOpen && (
          <div className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Pathways
              </button>
              <h2 className="font-semibold text-slate-800 line-clamp-2">{pathway.title}</h2>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <span>{completedModules.length} of {pathway.modules.length} completed</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${(completedModules.length / pathway.modules.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {pathway.modules.map((module, index) => {
                  const status = getModuleStatus(index);
                  const canAccess = canAccessModule(index);
                  const isActive = index === currentModuleIndex;

                  return (
                    <button
                      key={module.id}
                      onClick={() => canAccess && !isQuiz}
                      disabled={!canAccess || isQuiz}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-blue-50 border border-blue-200'
                          : status === 'completed'
                          ? 'bg-green-50 hover:bg-green-100'
                          : status === 'locked'
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          status === 'completed'
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-blue-500 text-white'
                            : status === 'locked'
                            ? 'bg-slate-200 text-slate-400'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {status === 'completed' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : status === 'locked' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium line-clamp-2 ${
                            isActive ? 'text-blue-700' : status === 'completed' ? 'text-green-700' : 'text-slate-700'
                          }`}>
                            {module.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              module.type === 'video' ? 'bg-purple-100 text-purple-700' :
                              module.type === 'reading' ? 'bg-blue-100 text-blue-700' :
                              module.type === 'exercise' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {module.type}
                            </span>
                            <span className="text-xs text-slate-400">{module.duration}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="font-semibold text-slate-800">{currentModule.title}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={`px-1.5 py-0.5 rounded ${
                    currentModule.type === 'video' ? 'bg-purple-100 text-purple-700' :
                    currentModule.type === 'reading' ? 'bg-blue-100 text-blue-700' :
                    currentModule.type === 'exercise' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {currentModule.type}
                  </span>
                  <span>{currentModule.duration}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isCurrentCompleted && !isQuiz && (
                <button
                  onClick={() => onModuleComplete(currentModule.id)}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Complete
                </button>
              )}
              {isCurrentCompleted && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </span>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              {isQuiz ? (
                <QuizComponent 
                  quizId={currentModule.id}
                  onComplete={handleQuizComplete}
                />
              ) : (
                <>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
                    {currentModule.type === 'video' && (
                      <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                            <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <p className="text-white/80 text-sm">Click to play video lesson</p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="h-1 bg-white/20 rounded-full">
                            <div className="h-full w-0 bg-blue-500 rounded-full" />
                          </div>
                          <div className="flex items-center justify-between mt-2 text-white text-xs">
                            <span>0:00</span>
                            <span>{currentModule.duration}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentModule.type === 'reading' && (
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">📖</span>
                          <h3 className="text-lg font-semibold text-slate-800">Reading Material</h3>
                        </div>
                        <div className="prose prose-slate max-w-none">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <h4 className="font-semibold text-blue-800 mb-2">Learning Objectives</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Understand the core concepts covered in this module</li>
                              <li>• Apply best practices in real-world scenarios</li>
                              <li>• Identify common pitfalls and how to avoid them</li>
                            </ul>
                          </div>
                          <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                            {currentModule.content}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentModule.type === 'exercise' && (
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">💻</span>
                          <h3 className="text-lg font-semibold text-slate-800">Hands-on Exercise</h3>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                          <h4 className="font-semibold text-amber-800 mb-2">Exercise Instructions</h4>
                          <ol className="text-sm text-amber-700 space-y-2 list-decimal list-inside">
                            <li>Review the provided starter code</li>
                            <li>Complete the implementation following the requirements</li>
                            <li>Test your solution with the provided test cases</li>
                            <li>Submit your solution for review</li>
                          </ol>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-sm">Code Editor</span>
                            <span className="text-slate-500 text-xs">JavaScript</span>
                          </div>
                          <pre className="text-green-400 text-sm font-mono">
{`// Your exercise code here
function implementSolution(input) {
  // TODO: Implement your solution
  
  return result;
}

// Test your implementation
console.log(implementSolution(testInput));`}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex border-b border-slate-200">
                      <button
                        onClick={() => setActiveTab('content')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'content'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Content
                      </button>
                      <button
                        onClick={() => setActiveTab('notes')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'notes'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        My Notes
                      </button>
                      <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === 'overview'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Overview
                      </button>
                    </div>

                    <div className="p-6">
                      {activeTab === 'content' && (
                        <div className="prose prose-slate max-w-none">
                          <p className="text-slate-600">{currentModule.description}</p>
                          
                          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                            <h4 className="font-medium text-slate-700 mb-2">Key Takeaways</h4>
                            <ul className="text-sm text-slate-600 space-y-1">
                              <li>• Essential concepts explained step by step</li>
                              <li>• Real-world examples and use cases</li>
                              <li>• Best practices and common patterns</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeTab === 'notes' && (
                        <div>
                          <h4 className="font-medium text-slate-700 mb-3">Your Notes</h4>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Take notes while you learn..."
                            className="w-full h-64 p-4 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-slate-400 mt-2">
                            Your notes are saved automatically
                          </p>
                        </div>
                      )}

                      {activeTab === 'overview' && (
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-medium text-slate-700 mb-2">About this Module</h4>
                            <p className="text-slate-600">{currentModule.description}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-700 mb-2">Skills You&apos;ll Learn</h4>
                            <div className="flex flex-wrap gap-2">
                              {pathway.skills.map((skill) => (
                                <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-700 mb-2">Instructor</h4>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                A-M
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">A-Mesob Training Team</p>
                                <p className="text-sm text-slate-500">Integration Specialists</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <footer className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between">
            <button
              disabled={currentModuleIndex === 0}
              onClick={() => {
                if (currentModuleIndex > 0) {
                  const prevIndex = currentModuleIndex - 1;
                  if (canAccessModule(prevIndex)) {
                    window.location.hash = `module-${prevIndex}`;
                    window.location.reload();
                  }
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Module {currentModuleIndex + 1} of {pathway.modules.length}
            </span>
            <button
              disabled={currentModuleIndex === pathway.modules.length - 1 || !canAccessModule(currentModuleIndex + 1)}
              onClick={() => {
                if (currentModuleIndex < pathway.modules.length - 1 && canAccessModule(currentModuleIndex + 1)) {
                  window.location.hash = `module-${currentModuleIndex + 1}`;
                  window.location.reload();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}
