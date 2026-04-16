'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppShell } from '@/components/layout';
import { QuizComponent } from '@/components/learning/QuizComponent';

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

const pathways: LearningPathway[] = [
  {
    id: 'gov-api',
    title: 'Government API Integration Fundamentals',
    description: 'Master integration with Ethiopian government ministry APIs including Kebele ID, e-Tax, and E-Passport systems. Essential for all Integration team members.',
    icon: '🏛️',
    category: 'Integration',
    totalHours: '12h 30m',
    moduleCount: 8,
    difficulty: 'Beginner',
    skills: ['REST API', 'Authentication', 'Error Handling', 'JSON Processing'],
    modules: [
      { 
        id: 'gov-1', 
        title: 'Understanding Ethiopian Government Systems', 
        description: 'Overview of ministry structure, API ecosystems, and regulatory framework for digital government services. Learn how different government agencies interact and share data.',
        duration: '45m', 
        type: 'video', 
        content: `# Understanding Ethiopian Government Digital Systems

## Introduction

Ethiopia's digital government transformation is led by several key ministries and agencies that manage citizen-facing services. Understanding this ecosystem is crucial for effective integration.

## Key Government Entities

### Ministry of Peace (Kebele ID System)
- Responsible for national identity management
- Manages the Kebele ID verification API
- Provides real-time citizen identity validation

### Ministry of Revenue (e-Tax System)
- Handles taxpayer registration and compliance
- Manages tax clearance certificates
- Provides API access for business registration verification

### Ministry of Immigration (E-Passport System)
- Manages passport applications and issuance
- Provides status tracking APIs
- Handles appointment scheduling

## Regulatory Framework

All API integrations must comply with:
- Data privacy regulations
- Security standards for government systems
- Interoperability requirements
- Service level agreements (SLAs)

## Best Practices

1. Always implement proper error handling
2. Use official documentation for API specifications
3. Test against staging environments before production
4. Maintain audit logs for all transactions
5. Follow ministry-specific rate limiting requirements`
      },
      { 
        id: 'gov-2', 
        title: 'REST API Best Practices', 
        description: 'Authentication patterns, rate limiting, and error handling for reliable integrations.',
        duration: '1h 30m', 
        type: 'video', 
        content: `# REST API Best Practices for Government Integrations

## Authentication

Government APIs typically use Bearer token authentication:

\`\`\`javascript
const response = await fetch(apiEndpoint, {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  }
});
\`\`\`

## Rate Limiting

Most government APIs enforce rate limits:
- **Kebele ID API**: 100 requests/minute
- **e-Tax API**: 50 requests/minute  
- **E-Passport API**: 30 requests/minute

## Error Handling

Implement robust error handling:

\`\`\`javascript
async function callGovernmentAPI(endpoint, data) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${token}\` },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new GovernmentAPIError(error.code, error.message);
    }
    
    return await response.json();
  } catch (error) {
    if (error.code === 'RATE_LIMITED') {
      await sleep(calculateBackoff());
      return callGovernmentAPI(endpoint, data);
    }
    throw error;
  }
}
\`\`\`

## Retry Strategies

- Implement exponential backoff
- Maximum 3 retry attempts
- Log all retry attempts for debugging`
      },
      { 
        id: 'gov-3', 
        title: 'Kebele ID Integration', 
        description: 'Real-time citizen identity verification using the Ministry of Peace API.',
        duration: '2h', 
        type: 'exercise', 
        content: `# Kebele ID Integration Exercise

## Objective

Build a complete Kebele ID verification integration that handles:
- Successful verification
- Invalid ID format
- Rate limiting
- Server errors

## Starter Code

\`\`\`javascript
class KebeleIDVerifier {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.requestQueue = [];
    this.lastRequestTime = 0;
  }

  async verify(kebeleId, fullName, dateOfBirth) {
    // TODO: Implement verification logic
    // Handle rate limiting (100 req/min)
    // Parse and validate response
    // Return verification result
  }

  async handleRateLimit() {
    // TODO: Implement exponential backoff
  }
}

// Test your implementation
const verifier = new KebeleIDVerifier('your-api-key', 'https://api.kebele.gov.et');
const result = await verifier.verify('ERK-1234567', 'John Doe', '1990-05-15');
console.log(result);
\`\`\`

## Requirements

1. Handle all HTTP status codes correctly
2. Implement rate limiting (max 100 requests/minute)
3. Parse verification responses
4. Handle network errors gracefully
5. Return structured verification result`
      },
      { 
        id: 'gov-4', 
        title: 'e-Tax Portal Integration', 
        description: 'Taxpayer registration and compliance verification through the Ministry of Revenue.',
        duration: '2h 15m', 
        type: 'video', 
        content: `# e-Tax Portal Integration Guide

## Overview

The e-Tax Portal provides APIs for:
- Taxpayer registration verification
- TIN (Tax Identification Number) validation
- Tax clearance certificate verification

## API Endpoints

### Verify Taxpayer
\`POST /api/v1/taxpayer/verify\`

**Request:**
\`\`\`json
{
  "tin": "1234567890",
  "businessName": "Company Name",
  "registrationDate": "2020-01-15"
}
\`\`\`

**Response:**
\`\`\`json
{
  "status": "verified",
  "taxpayerType": "business",
  "complianceStatus": "compliant",
  "lastReturnDate": "2024-03-31"
}
\`\`\`

## Common Error Codes

| Code | Description | Action |
|------|-------------|--------|
| E-T001 | Invalid TIN format | Validate TIN before sending |
| E-T002 | TIN not found | Check with taxpayer |
| E-T003 | Registration mismatch | Verify business details |
| E-T004 | System unavailable | Retry later |

## Legacy Data Considerations

Note: Some legacy systems use Ethiopian calendar dates. Handle date conversions appropriately.`
      },
      { 
        id: 'gov-5', 
        title: 'E-Passport API Integration', 
        description: 'Passport application submission and status tracking via the Immigration Authority.',
        duration: '1h 45m', 
        type: 'reading', 
        content: `# E-Passport API Integration Guide

## Overview

The E-Passport system provides APIs for citizen passport services including application submission, status tracking, and appointment management.

## Session Management

E-Passport sessions expire after 15 minutes of inactivity. Implement JWT refresh token rotation:

\`\`\`javascript
class EPassportSession {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
  }

  async ensureValidSession() {
    if (!this.accessToken || this.isExpired()) {
      await this.refresh();
    }
  }

  async refresh() {
    const response = await fetch('/oauth/token', {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    });
    
    const tokens = await response.json();
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    this.expiresAt = Date.now() + (tokens.expires_in * 1000);
  }
}
\`\`\`

## Photo Upload Requirements

- **Format**: JPEG or PNG
- **Size**: 10KB - 200KB
- **Dimensions**: 35mm x 45mm (standard passport photo)
- **Background**: White or light blue
- **Resolution**: Minimum 300 DPI

## Regional Sync Delays

Updates from regional passport offices take 2-4 hours to sync with the central database. Account for this in your status checks.`
      },
      { 
        id: 'gov-6', 
        title: 'Authentication & Security', 
        description: 'Bearer tokens, OAuth flows, and secure credential management.',
        duration: '1h 30m', 
        type: 'video', 
        content: `# API Security Best Practices

## Credential Management

Never hardcode credentials. Use environment variables or secret management systems:

\`\`\`javascript
// Bad Practice
const API_KEY = 'super-secret-key-123';

// Good Practice
const API_KEY = process.env.GOV_API_KEY;
\`\`\`

## OAuth 2.0 Implementation

Government APIs often use OAuth 2.0 for authentication:

1. **Client Credentials Flow** (for server-to-server):
\`\`\`javascript
const tokenResponse = await fetch('/oauth/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  })
});
\`\`\`

2. **JWT Validation**:
\`\`\`javascript
function validateToken(token) {
  const decoded = jwt.decode(token);
  return decoded.exp > Date.now() / 1000;
}
\`\`\`

## Security Checklist

- [ ] Store credentials in environment variables
- [ ] Implement token refresh logic
- [ ] Use HTTPS for all API calls
- [ ] Log authentication events
- [ ] Implement rate limiting on your end
- [ ] Rotate credentials regularly`
      },
      { 
        id: 'gov-7', 
        title: 'Error Handling Patterns', 
        description: 'Retry logic, circuit breakers, and graceful degradation strategies.',
        duration: '1h 15m', 
        type: 'reading', 
        content: `# Error Handling Patterns for Government APIs

## Circuit Breaker Pattern

Implement circuit breakers to prevent cascading failures:

\`\`\`javascript
class CircuitBreaker {
  constructor(failureThreshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.failureThreshold = failureThreshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = 0;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
\`\`\`

## Graceful Degradation

When a government API is unavailable:
1. Check for cached/stale data
2. Show degraded functionality
3. Inform users of limited service
4. Queue operations for retry`
      },
      { 
        id: 'gov-8', 
        title: 'Final Assessment', 
        description: 'Demonstrate your understanding with a comprehensive integration challenge.',
        duration: '1h 30m', 
        type: 'quiz', 
        content: 'Final assessment for Government API Integration Fundamentals'
      },
    ],
  },
  {
    id: 'fintech',
    title: 'FinTech Payment Gateway Integration',
    description: 'Learn to integrate Telebirr, CBE, and commercial bank payment systems. Critical for payment-focused team members.',
    icon: '💳',
    category: 'FinTech',
    totalHours: '10h 15m',
    moduleCount: 6,
    difficulty: 'Intermediate',
    skills: ['Telebirr', 'CBE API', 'Idempotency', 'Webhooks'],
    modules: [
      { id: 'fin-1', title: 'Ethiopian Payment Landscape', description: 'Overview of mobile money, banking APIs, and regulatory requirements.', duration: '1h', type: 'video', content: 'Introduction to Ethiopian payment systems...' },
      { id: 'fin-2', title: 'Telebirr API Deep Dive', description: 'Mobile money payment integration patterns with USSD and webhook handling.', duration: '2h 30m', type: 'exercise', content: 'Telebirr integration workshop...' },
      { id: 'fin-3', title: 'Bank Reconciliation', description: 'Payment matching, discrepancy handling, and reconciliation automation.', duration: '2h', type: 'video', content: 'Bank reconciliation best practices...' },
      { id: 'fin-4', title: 'Idempotency & Security', description: 'Preventing duplicate charges, fraud detection, and secure payment flows.', duration: '1h 45m', type: 'reading', content: 'Payment security patterns...' },
      { id: 'fin-5', title: 'Webhook Integration', description: 'Real-time payment notifications, retry logic, and idempotency keys.', duration: '1h 30m', type: 'video', content: 'Webhook integration guide...' },
      { id: 'fin-6', title: 'Final Assessment', description: 'Build a complete payment integration following best practices.', duration: '1h 30m', type: 'quiz', content: 'FinTech Integration Assessment' },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps & Infrastructure Excellence',
    description: 'Skills for managing Ethiopian digital infrastructure including AWS Ethiopia Region, Kubernetes, and monitoring.',
    icon: '⚙️',
    category: 'DevOps',
    totalHours: '15h',
    moduleCount: 7,
    difficulty: 'Advanced',
    skills: ['Kubernetes', 'AWS', 'Monitoring', 'CI/CD'],
    modules: [
      { id: 'dev-1', title: 'AWS Ethiopia Region Operations', description: 'Managing infrastructure on af-east-1, IAM policies, and regional differences.', duration: '2h 30m', type: 'video', content: 'AWS Ethiopia region guide...' },
      { id: 'dev-2', title: 'Kubernetes on Government Networks', description: 'Container orchestration, service mesh, and network policies.', duration: '3h', type: 'exercise', content: 'Kubernetes deployment workshop...' },
      { id: 'dev-3', title: 'Ethio Telecom Integration', description: 'SMS, USSD, and connectivity management for telecom services.', duration: '2h', type: 'video', content: 'Ethio Telecom integration guide...' },
      { id: 'dev-4', title: 'Incident Response Playbooks', description: 'Government service outage handling, escalation procedures, and communication.', duration: '2h', type: 'reading', content: 'Incident response procedures...' },
      { id: 'dev-5', title: 'Monitoring & Alerting', description: 'Datadog, Prometheus, and custom dashboards for service health.', duration: '2h', type: 'video', content: 'Monitoring best practices...' },
      { id: 'dev-6', title: 'CI/CD Pipelines', description: 'Automated testing, deployment strategies, and rollback procedures.', duration: '2h', type: 'exercise', content: 'CI/CD pipeline workshop...' },
      { id: 'dev-7', title: 'Final Assessment', description: 'Design and deploy a complete microservice infrastructure.', duration: '1h 30m', type: 'quiz', content: 'DevOps Infrastructure Assessment' },
    ],
  },
  {
    id: 'qa',
    title: 'Quality Assurance for Government Services',
    description: 'Testing strategies for citizen-facing services with zero-failure rate requirements.',
    icon: '✅',
    category: 'Quality Assurance',
    totalHours: '8h 45m',
    moduleCount: 5,
    difficulty: 'Intermediate',
    skills: ['Integration Testing', 'Performance', 'Citizen Experience', 'Automation'],
    modules: [
      { id: 'qa-1', title: 'QA in Government Services', description: 'Understanding SLA requirements, citizen impact, and quality standards.', duration: '1h 15m', type: 'video', content: 'QA principles for government services...' },
      { id: 'qa-2', title: 'Integration Testing Strategies', description: 'API testing, contract testing, and end-to-end scenarios.', duration: '2h', type: 'exercise', content: 'Integration testing workshop...' },
      { id: 'qa-3', title: 'Performance Benchmarks', description: 'Load testing, latency requirements, and capacity planning.', duration: '1h 45m', type: 'video', content: 'Performance testing guide...' },
      { id: 'qa-4', title: 'Citizen Experience Metrics', description: 'Measuring success from the citizen perspective, NPS, and satisfaction.', duration: '1h 30m', type: 'reading', content: 'Citizen experience measurement...' },
      { id: 'qa-5', title: 'Final Assessment', description: 'Create a comprehensive test plan for a government service.', duration: '1h 45m', type: 'quiz', content: 'QA Assessment' },
    ],
  },
];

type PathwayWithProgress = LearningPathway & {
  enrolled?: boolean;
  completedCount?: number;
  certificateEarned?: boolean;
};

function PathwayCard({ pathway, onClick }: { pathway: PathwayWithProgress; onClick: () => void }) {
  const progress = pathway.modules.filter((_, i) => i < (pathway.completedCount ?? 0)).length;
  const isEnrolled = pathway.enrolled ?? false;
  const isComplete = pathway.certificateEarned ?? false;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className={`p-3 sm:p-4 ${isEnrolled ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-100'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl ${isEnrolled ? 'bg-white/20' : 'bg-slate-200'}`}>
            {pathway.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${isEnrolled ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {pathway.category}
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                pathway.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                pathway.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                {pathway.difficulty}
              </span>
            </div>
            <h3 className={`font-semibold text-sm sm:text-base ${isEnrolled ? 'text-white' : 'text-slate-800'}`}>
              {pathway.title}
            </h3>
            <p className={`text-xs mt-0.5 line-clamp-2 ${isEnrolled ? 'text-blue-100' : 'text-slate-500'}`}>
              {pathway.description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{pathway.totalHours}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{pathway.moduleCount} modules</span>
          </div>
        </div>

        {isEnrolled && (
          <>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>{progress}/{pathway.moduleCount}</span>
              <span>{Math.round((progress / pathway.moduleCount) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                style={{ width: `${(progress / pathway.moduleCount) * 100}%` }}
              />
            </div>
          </>
        )}

        {isComplete && (
          <div className="mt-3 flex items-center justify-center gap-1.5 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <span className="text-lg">🏆</span>
            <span className="text-xs font-medium text-green-700">Certificate Earned</span>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-1">
          {pathway.skills.slice(0, 2).map((skill) => (
            <span key={skill} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              {skill}
            </span>
          ))}
          {pathway.skills.length > 2 && (
            <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-full">
              +{pathway.skills.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CertificateBadge({ pathway }: { pathway: LearningPathway }) {
  return (
    <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 border border-amber-200 text-center">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-4xl shadow-lg">
        🏆
      </div>
      <h3 className="text-xl font-bold text-amber-800 mb-2">Certificate of Completion</h3>
      <p className="text-sm text-amber-700 mb-1">
        You&apos;ve successfully completed
      </p>
      <p className="font-semibold text-amber-900 mb-4">{pathway.title}</p>
      <button className="px-6 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors">
        Download Certificate
      </button>
    </div>
  );
}

export default function LearningPage() {
  const { user } = useAuth();
  const [pathwaysData, setPathwaysData] = useState(() => 
    pathways.map(p => ({
      ...p,
      enrolled: p.id === 'gov-api',
      completedCount: p.id === 'gov-api' ? 3 : 0,
      certificateEarned: false,
    }))
  );
  const [selectedPathwayId, setSelectedPathwayId] = useState<string | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [showContentViewer, setShowContentViewer] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled' | 'completed'>('all');

  const filteredPathways = useMemo(() => {
    switch (activeTab) {
      case 'enrolled':
        return pathwaysData.filter(p => p.enrolled);
      case 'completed':
        return pathwaysData.filter(p => p.certificateEarned);
      default:
        return pathwaysData;
    }
  }, [pathwaysData, activeTab]);

  const selectedPathway = selectedPathwayId 
    ? pathwaysData.find(p => p.id === selectedPathwayId) 
    : null;

  const handleModuleComplete = (pathwayId: string, moduleId: string) => {
    setPathwaysData(prev => prev.map(p => {
      if (p.id !== pathwayId) return p;
      
      const moduleIndex = p.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1 || p.completedCount >= moduleIndex + 1) return p;
      
      const newCompletedCount = moduleIndex + 1;
      const isComplete = newCompletedCount === p.modules.length;
      
      return {
        ...p,
        completedCount: newCompletedCount,
        certificateEarned: isComplete,
      };
    }));
  };

  const handleOpenPathway = (pathwayId: string) => {
    setSelectedPathwayId(pathwayId);
    setActiveModuleIndex(0);
    setShowContentViewer(true);
  };

  const handleOpenModule = (moduleIndex: number) => {
    const pathway = pathwaysData.find(p => p.id === selectedPathwayId);
    if (!pathway) return;
    
    if (moduleIndex === 0 || pathway.completedCount >= moduleIndex) {
      setActiveModuleIndex(moduleIndex);
    }
  };

  const currentModule = selectedPathway?.modules[activeModuleIndex];
  const isCurrentCompleted = selectedPathway ? selectedPathway.completedCount > activeModuleIndex : false;
  const canAccessModule = (index: number) => {
    if (!selectedPathway) return false;
    return index === 0 || selectedPathway.completedCount >= index;
  };

  if (showContentViewer && selectedPathway) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="flex h-[calc(100vh-64px)]">
          <div className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <button
                onClick={() => setShowContentViewer(false)}
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Pathways
              </button>
              <h2 className="font-semibold text-slate-800 line-clamp-2">{selectedPathway.title}</h2>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <span>{selectedPathway.completedCount} of {selectedPathway.modules.length} completed</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${(selectedPathway.completedCount / selectedPathway.modules.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {selectedPathway.modules.map((module, index) => {
                  const isCompleted = selectedPathway.completedCount > index;
                  const isActive = index === activeModuleIndex;
                  const isAccessible = canAccessModule(index);

                  return (
                    <button
                      key={module.id}
                      onClick={() => isAccessible && handleOpenModule(index)}
                      disabled={!isAccessible}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-blue-50 border border-blue-200'
                          : isCompleted
                          ? 'bg-green-50 hover:bg-green-100'
                          : isAccessible
                          ? 'hover:bg-slate-50'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-blue-500 text-white'
                            : !isAccessible
                            ? 'bg-slate-200 text-slate-400'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isCompleted ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : !isAccessible ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium line-clamp-2 ${
                            isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-slate-700'
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

          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="font-semibold text-slate-800">{currentModule?.title}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className={`px-1.5 py-0.5 rounded ${
                    currentModule?.type === 'video' ? 'bg-purple-100 text-purple-700' :
                    currentModule?.type === 'reading' ? 'bg-blue-100 text-blue-700' :
                    currentModule?.type === 'exercise' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {currentModule?.type}
                  </span>
                  <span>{currentModule?.duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {currentModule?.type === 'quiz' ? (
                  isCurrentCompleted ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Quiz Passed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleModuleComplete(selectedPathway.id, currentModule.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Take Quiz
                    </button>
                  )
                ) : isCurrentCompleted ? (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => currentModule && handleModuleComplete(selectedPathway.id, currentModule.id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {selectedPathway.certificateEarned && activeModuleIndex === selectedPathway.modules.length - 1 ? (
                  <CertificateBadge pathway={selectedPathway} />
                ) : currentModule?.type === 'quiz' && !isCurrentCompleted ? (
                  <QuizComponent
                    quizId={currentModule.id}
                    onComplete={(passed) => {
                      if (passed && currentModule) {
                        handleModuleComplete(selectedPathway.id, currentModule.id);
                      }
                    }}
                  />
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {currentModule?.type === 'video' && (
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
                            <span>{currentModule?.duration}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentModule?.type === 'reading' && (
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
                            {currentModule?.content}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentModule?.type === 'exercise' && (
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
                            <li>Mark as complete when done</li>
                          </ol>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-400 text-sm">Code Editor</span>
                            <span className="text-slate-500 text-xs">JavaScript</span>
                          </div>
                          <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
{currentModule?.content}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <footer className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between">
              <button
                disabled={activeModuleIndex === 0}
                onClick={() => handleOpenModule(activeModuleIndex - 1)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="text-sm text-slate-500">
                Module {activeModuleIndex + 1} of {selectedPathway?.modules.length}
              </span>
              <button
                disabled={activeModuleIndex === (selectedPathway?.modules.length ?? 0) - 1 || !canAccessModule(activeModuleIndex + 1)}
                onClick={() => handleOpenModule(activeModuleIndex + 1)}
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

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              📚 My Learning
            </h1>
            <p className="text-slate-500 mt-0.5 text-xs sm:text-sm">
              Master the skills needed for government digital services
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-slate-500">Welcome back,</p>
                <p className="font-medium text-slate-800">{user.name}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-white rounded-lg border border-slate-200 p-1 w-fit">
          {(['all', 'enrolled', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'enrolled' && (
                <span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                  {pathwaysData.filter(p => p.enrolled).length}
                </span>
              )}
              {tab === 'completed' && (
                <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                  {pathwaysData.filter(p => p.certificateEarned).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPathways.map((pathway) => (
            <PathwayCard
              key={pathway.id}
              pathway={pathway}
              onClick={() => handleOpenPathway(pathway.id)}
            />
          ))}
        </div>

        {filteredPathways.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
              📚
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">No pathways found</h3>
            <p className="text-sm text-slate-500">
              {activeTab === 'enrolled'
                ? "You haven't enrolled in any pathways yet."
                : "You haven't completed any pathways yet."}
            </p>
          </div>
        )}

        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 sm:p-5 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">
              💡
            </div>
            <div>
              <h3 className="font-medium text-sm mb-0.5">Want to suggest a new pathway?</h3>
              <p className="text-xs text-slate-300 mb-2">
                Help us improve the learning catalog by suggesting topics.
              </p>
              <button className="px-3 py-1.5 bg-white text-slate-800 font-medium rounded-lg hover:bg-slate-100 transition-colors text-xs">
                Suggest a Pathway
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
