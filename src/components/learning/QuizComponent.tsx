'use client';

import { useState } from 'react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export const quizData: Record<string, Quiz> = {
  'gov-3': {
    id: 'gov-3-quiz',
    title: 'Kebele ID Integration Quiz',
    passingScore: 80,
    questions: [
      {
        id: 'q1',
        question: 'What is the primary purpose of the Kebele ID Verification API?',
        options: [
          'Generate new kebele IDs',
          'Verify citizen identity in real-time',
          'Store citizen biometrics',
          'Manage appointments'
        ],
        correctAnswer: 1,
        explanation: 'The Kebele ID Verification API verifies citizen identity in real-time.'
      },
      {
        id: 'q2',
        question: 'What authentication method is used for the Kebele ID API?',
        options: ['API Key only', 'OAuth 2.0', 'Bearer token', 'Basic Auth'],
        correctAnswer: 2,
        explanation: 'Bearer token with ministry-issued credentials is the standard.'
      },
      {
        id: 'q3',
        question: 'What HTTP status indicates successful identity verification?',
        options: ['201 Created', '200 OK', '204 No Content', '301 Redirect'],
        correctAnswer: 1,
        explanation: 'A 200 OK status indicates successful identity verification.'
      },
      {
        id: 'q4',
        question: 'What should you do when receiving a 429 (Rate Limit) response?',
        options: ['Abort immediately', 'Retry immediately', 'Retry with exponential backoff', 'Log and continue'],
        correctAnswer: 2,
        explanation: 'Use exponential backoff to avoid overwhelming the API.'
      },
      {
        id: 'q5',
        question: 'Which error code indicates citizen not found in registry?',
        options: ['E001', 'E002', 'E003', '404'],
        correctAnswer: 3,
        explanation: 'A 404 response indicates the citizen was not found.'
      }
    ]
  },
  'gov-7': {
    id: 'gov-7-quiz',
    title: 'Error Handling Patterns Quiz',
    passingScore: 80,
    questions: [
      {
        id: 'q1',
        question: 'What is the primary purpose of a circuit breaker?',
        options: ['Prevent duplicate calls', 'Stop cascading failures', 'Speed up responses', 'Encrypt traffic'],
        correctAnswer: 1,
        explanation: 'Circuit breakers stop cascading failures and allow recovery.'
      },
      {
        id: 'q2',
        question: 'What is exponential backoff?',
        options: ['Decreasing wait time', 'Increasing wait exponentially', 'Type of encryption', 'Speed up transfer'],
        correctAnswer: 1,
        explanation: 'Exponential backoff increases wait time between retries.'
      },
      {
        id: 'q3',
        question: 'What is idempotency in API calls?',
        options: ['Making calls faster', 'Same result every time', 'Encrypting payloads', 'Compressing data'],
        correctAnswer: 1,
        explanation: 'Idempotency means the same request produces the same result.'
      },
      {
        id: 'q4',
        question: 'When should you implement retry logic?',
        options: ['For all calls', 'For transient failures only', 'For client errors only', 'Never'],
        correctAnswer: 1,
        explanation: 'Retry for transient failures (timeouts, 5xx errors) only.'
      },
      {
        id: 'q5',
        question: 'What is graceful degradation?',
        options: ['Speeding up APIs', 'Reduced functionality on failure', 'Encrypting data', 'Reducing endpoints'],
        correctAnswer: 1,
        explanation: 'Graceful degradation provides reduced but functional service.'
      }
    ]
  },
  'gov-8': {
    id: 'gov-8-quiz',
    title: 'Final Assessment',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: 'What are the three main government APIs integrated by A-Mesob?',
        options: [
          'Customs, Health, Immigration',
          'Kebele ID, e-Tax, E-Passport',
          'Finance, Trade, Agriculture',
          'Education, Labor, Social'
        ],
        correctAnswer: 1,
        explanation: 'A-Mesob integrates with Kebele ID, e-Tax, and E-Passport APIs.'
      },
      {
        id: 'q2',
        question: 'What is the maximum rate limit for Kebele ID API?',
        options: ['50/min', '100/min', '200/min', '500/min'],
        correctAnswer: 1,
        explanation: 'The Kebele ID API has a rate limit of 100 requests/minute.'
      },
      {
        id: 'q3',
        question: 'How long is the E-Passport Portal session timeout?',
        options: ['5 minutes', '15 minutes', '30 minutes', '60 minutes'],
        correctAnswer: 1,
        explanation: 'E-Passport Portal sessions timeout after 15 minutes.'
      },
      {
        id: 'q4',
        question: 'What date format might you encounter in legacy e-Tax data?',
        options: ['YYYY-MM-DD', 'DD/MM/YYYY', 'Ethiopian calendar', 'Julian dates'],
        correctAnswer: 2,
        explanation: 'Legacy e-Tax systems may use Ethiopian calendar dates.'
      },
      {
        id: 'q5',
        question: 'What is the recommended approach for ministry server downtime?',
        options: ['Queue indefinitely', 'Fail silently', 'Failover with notification', 'Retry every second'],
        correctAnswer: 2,
        explanation: 'Failover to backup with user notification.'
      },
      {
        id: 'q6',
        question: 'What JWT feature should be implemented for E-Passport?',
        options: ['Long-lived tokens', 'Refresh token rotation', 'No auth needed', 'Basic auth'],
        correctAnswer: 1,
        explanation: 'JWT refresh token rotation is recommended.'
      },
      {
        id: 'q7',
        question: 'What is the acceptable E-Passport photo size?',
        options: ['5KB-50KB', '10KB-200KB', '200KB-500KB', '1MB-2MB'],
        correctAnswer: 1,
        explanation: 'Ethiopian passport photos must be between 10KB and 200KB.'
      },
      {
        id: 'q8',
        question: 'How long do regional E-Passport data sync delays take?',
        options: ['Real-time', '1-2 hours', '2-4 hours', '1-2 days'],
        correctAnswer: 2,
        explanation: 'Updates take 2-4 hours to sync with central database.'
      }
    ]
  }
};

interface QuizComponentProps {
  quizId: string;
  onComplete: (passed: boolean, score: number) => void;
}

export function QuizComponent({ quizId, onComplete }: QuizComponentProps) {
  const quiz = quizData[quizId];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const passed = score >= quiz.passingScore;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
    setAnswers(prev => ({ ...prev, [question.id]: selectedAnswer }));
  };

  const handleNext = () => {
    const correctCount = Object.entries(answers).filter(([qId, ans]) => {
      const q = quiz.questions.find(q => q.id === qId);
      return q && q.correctAnswer === ans;
    }).length + (selectedAnswer === question.correctAnswer && !answers[question.id] ? 1 : 0);
    
    setScore(Math.round((correctCount / quiz.questions.length) * 100));

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
      const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
      onComplete(finalScore >= quiz.passingScore, finalScore);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswers({});
    setQuizComplete(false);
    setScore(0);
  };

  if (quizComplete) {
    const correctCount = Object.values(answers).filter((ans, idx) => {
      const q = quiz.questions[idx];
      return q && q.correctAnswer === ans;
    }).length;

    return (
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="text-center">
          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl ${
            passed ? 'bg-green-100' : 'bg-amber-100'
          }`}>
            {passed ? '🎉' : '📚'}
          </div>
          
          <h3 className={`text-lg font-bold ${passed ? 'text-green-700' : 'text-amber-700'}`}>
            {passed ? 'Passed!' : 'Keep Trying'}
          </h3>
          
          <p className="text-sm text-slate-500 mt-1">
            {passed ? 'Assessment passed successfully.' : 'Review the material and try again.'}
          </p>

          <div className={`mt-3 inline-block px-4 py-2 rounded-lg ${passed ? 'bg-green-50' : 'bg-slate-50'}`}>
            <span className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-slate-700'}`}>
              {score}%
            </span>
          </div>

          <div className="flex justify-center gap-4 mt-3 text-sm">
            <span className="text-green-600">✓ {correctCount} correct</span>
            <span className="text-red-600">✗ {quiz.questions.length - correctCount} wrong</span>
          </div>

          {!passed && (
            <button
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium text-sm">{quiz.title}</h3>
          <span className="text-blue-200 text-xs">
            {currentQuestion + 1}/{quiz.questions.length}
          </span>
        </div>
        <div className="h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm font-medium text-slate-800 mb-3">
          {question.question}
        </p>

        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            
            let optionClass = 'border-slate-200 hover:border-blue-300 hover:bg-blue-50';
            if (showExplanation) {
              if (isCorrect) {
                optionClass = 'border-green-500 bg-green-50';
              } else if (isSelected && !isCorrect) {
                optionClass = 'border-red-500 bg-red-50';
              } else {
                optionClass = 'border-slate-200 opacity-50';
              }
            } else if (isSelected) {
              optionClass = 'border-blue-500 bg-blue-50';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full px-3 py-2 rounded-lg border text-left text-sm transition-all ${optionClass}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                    isSelected && !showExplanation
                      ? 'bg-blue-500 text-white'
                      : showExplanation && isCorrect
                      ? 'bg-green-500 text-white'
                      : showExplanation && isSelected && !isCorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {showExplanation ? (
                      isCorrect ? '✓' : isSelected ? '✗' : String.fromCharCode(65 + index)
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span className="text-slate-700">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            selectedAnswer === question.correctAnswer 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <p className={`font-medium ${
              selectedAnswer === question.correctAnswer ? 'text-green-800' : 'text-amber-800'
            }`}>
              {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-slate-600 mt-1 text-xs">
              {question.explanation}
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          {!showExplanation ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              {currentQuestion < quiz.questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
