import { User, KnowledgeArticle, InsightPost, IssueTicket, OffboardingRecord, LearningPathway, Notification, QMSFeedback } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Bethel Haile',
    email: 'bethel.haile@a-mesob.et',
    role: 'junior',
    department: 'Integration',
    joinDate: '2025-03-15',
    avatar: 'BH',
    technicalSkills: [
      { name: 'REST API Integration', completed: true, completedAt: '2025-04-10' },
      { name: 'Ministry APIs Documentation', completed: true, completedAt: '2025-04-25' },
      { name: 'Telebirr SDK Integration', completed: false },
      { name: 'Error Handling Patterns', completed: false },
    ],
    supervisorId: '2',
    bio: 'Passionate about seamless government-to-citizen digital services.',
  },
  {
    id: '2',
    name: 'Daniel Kebede',
    email: 'daniel.kebede@a-mesob.et',
    role: 'senior',
    department: 'Integration',
    joinDate: '2023-08-01',
    avatar: 'DK',
    technicalSkills: [
      { name: 'API Architecture Design', completed: true },
      { name: 'Kebele ID Integration', completed: true },
      { name: 'Revenue Authority e-Tax', completed: true },
      { name: 'Microservices Patterns', completed: true },
    ],
    bio: 'Integration architect specializing in Ethiopian government systems.',
  },
  {
    id: '3',
    name: 'Tigist Alemu',
    email: 'tigist.alemu@a-mesob.et',
    role: 'admin',
    department: 'Product',
    joinDate: '2022-01-10',
    avatar: 'TA',
    technicalSkills: [
      { name: 'Platform Architecture', completed: true },
      { name: 'Security Compliance', completed: true },
      { name: 'Knowledge Management', completed: true },
      { name: 'Stakeholder Management', completed: true },
    ],
    bio: 'Product lead driving digital transformation across Ethiopian government services.',
  },
  {
    id: '4',
    name: 'Samuel Teshome',
    email: 'samuel.teshome@a-mesob.et',
    role: 'junior',
    department: 'DevOps',
    joinDate: '2025-01-20',
    avatar: 'ST',
    technicalSkills: [
      { name: 'Docker & Kubernetes', completed: true, completedAt: '2025-02-15' },
      { name: 'CI/CD Pipeline Setup', completed: false },
      { name: 'AWS Ethiopia Region', completed: false },
    ],
    supervisorId: '5',
  },
  {
    id: '5',
    name: 'Frehiwot Worku',
    email: 'frehiwot.worku@a-mesob.et',
    role: 'senior',
    department: 'DevOps',
    joinDate: '2021-06-15',
    avatar: 'FW',
    technicalSkills: [
      { name: 'Infrastructure as Code', completed: true },
      { name: 'Telebirr Gateway运维', completed: true },
      { name: 'Ministry Network Config', completed: true },
    ],
    bio: 'DevOps lead ensuring 99.9% uptime for critical government services.',
  },
  {
    id: '6',
    name: 'Abebe Girma',
    email: 'abebe.girma@a-mesob.et',
    role: 'senior',
    department: 'Quality Assurance',
    joinDate: '2020-11-01',
    avatar: 'AG',
    technicalSkills: [
      { name: 'Integration Testing', completed: true },
      { name: 'Performance Benchmarks', completed: true },
      { name: 'Citizen Experience Metrics', completed: true },
    ],
    bio: 'QA lead focused on zero-failure rates for citizen-facing services.',
  },
];

export const mockArticles: KnowledgeArticle[] = [
  // Government Integrations (3 articles)
  {
    id: '1',
    title: 'Kebele ID Verification API Integration Guide',
    content: `# Kebele ID Verification API Integration

## Overview
Integration with the Ministry of Peace Kebele ID system for real-time citizen identity verification.

## API Endpoint
\`\`\`javascript
const KEBILE_API = 'https://api.kebele.gov.et/v2/verify';
\`\`\`

## Authentication
Bearer token authentication using ministry-issued credentials.

## Request Format
\`\`\`json
{
  "kebele_id": "ERK-1234567",
  "full_name": "የስም",
  "date_of_birth": "1990-05-15",
  "region": "Addis Ababa"
}
\`\`\`

## Response Handling
- **200**: Identity verified successfully
- **404**: Citizen not found in registry
- **429**: Rate limit exceeded (max 100 req/min)

## Error Codes
| Code | Description | Action |
|------|-------------|--------|
| E001 | Invalid ID format | Validate input format |
| E002 | Database timeout | Retry with exponential backoff |
| E003 | Ministry server down | Failover to backup system |`,
    category: 'Government Integrations',
    authorId: '2',
    tags: ['kebele', 'identity', 'verification', 'ministry'],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-04-01T09:00:00Z',
    views: 2341,
    likes: 187,
    status: 'published',
  },
  {
    id: '2',
    title: 'Ministry of Revenue e-Tax Portal Data Migration',
    content: `# e-Tax Portal Data Migration Playbook

## Scope
Migrating taxpayer records from legacy CSV format to JSON API structure.

## Migration Steps

### Phase 1: Data Extraction
\`\`\`python
import pandas as pd
from tax_migration import Transform

def extract_legacy_taxpayers(file_path: str) -> pd.DataFrame:
    df = pd.read_csv(file_path, encoding='utf-8-sig')
    return Transform.to_json_schema(df)
\`\`\`

### Phase 2: Validation
- TIN format validation ( Ethiopian TIN is 10 digits)
- Duplicate detection across regional databases
- Tax bracket recalculation

### Phase 3: Load
Use batch insert with transaction rollback on failure.

## Known Issues
- Some TINs from Oromia region missing leading zeros
- Legacy system uses Ethiopian calendar dates`,
    category: 'Government Integrations',
    authorId: '2',
    tags: ['e-tax', 'migration', 'revenue', 'data'],
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-04-15T14:30:00Z',
    views: 1567,
    likes: 134,
    status: 'published',
  },
  {
    id: '3',
    title: 'E-Passport Portal API Error Handling Patterns',
    content: `# E-Passport Portal Error Handling

## Common Error Scenarios

### 1. Session Timeout During Application
Citizens submitting passport applications may experience session timeouts after 15 minutes of inactivity.

**Solution**: Implement JWT refresh token rotation with silent re-authentication.

### 2. Photo Upload Size Limits
 Ethiopian passport photos must be between 10KB and 200KB.

### 3. Regional Server Sync Delays
Updates from regional passport offices take 2-4 hours to reflect in central database.

## Circuit Breaker Configuration
\`\`\`yaml
circuit_breaker:
  failure_threshold: 5
  recovery_timeout: 30s
  half_open_max_calls: 3
\`\`\``,
    category: 'Government Integrations',
    authorId: '3',
    tags: ['e-passport', 'errors', 'handling', 'session'],
    createdAt: '2025-03-10T10:30:00Z',
    updatedAt: '2025-04-20T14:22:00Z',
    views: 892,
    likes: 76,
    status: 'published',
  },

  // FinTech & Payment Gateways (2 articles)
  {
    id: '4',
    title: 'Telebirr API Integration & Timeout Handling',
    content: `# Telebirr Payment Gateway Integration

## Overview
Integrating Safaricom's Telebirr mobile money payment for government service fees.

## API Integration
\`\`\`javascript
class TelebirrGateway {
  async initiatePayment(amount: number, billRef: string) {
    const response = await fetch('https://api.telebirr.et/v1/payment', {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.TELEBIRR_API_KEY,
        'X-Merchant-ID': 'A-MESOB-GOV-001'
      },
      body: JSON.stringify({
        amount,
        billReference: billRef,
        callbackUrl: 'https://a-mesob.et/payment/callback',
        expirationMinutes: 15
      })
    });
    return response.json();
  }
}
\`\`\`

## Timeout Handling
Telebirr transactions must complete within 15 minutes. Implement:
1. Polling every 30 seconds
2. Webhook backup notification
3. Auto-refund after expiration

## Common Issues
- **USSD push failures**: Retry up to 3 times
- **Network timeouts**: Check transaction status before retrying
- **Duplicate submissions**: Idempotency keys are mandatory`,
    category: 'FinTech & Payment Gateways',
    authorId: '5',
    tags: ['telebirr', 'payment', 'mobile-money', 'fintech'],
    createdAt: '2025-01-25T08:00:00Z',
    updatedAt: '2025-04-15T16:30:00Z',
    views: 3421,
    likes: 298,
    status: 'published',
  },
  {
    id: '5',
    title: 'Commercial Bank of Ethiopia Payment Reconciliation',
    content: `# CBE Payment Reconciliation Process

## Daily Reconciliation Workflow

### Morning Batch (6:00 AM EAT)
Fetch previous day's transactions from CBE bulk API.

### Reconciliation Steps
1. Compare transaction IDs
2. Match payment amounts (handle rounding for different currencies)
3. Flag unmatched transactions
4. Generate discrepancy report

### Code Example
\`\`\`python
from cbe_client import CBEClient
from datetime import datetime, timedelta

def reconcile_payments(date: datetime):
    cbe = CBEClient(api_key=os.getenv('CBE_API_KEY'))
    transactions = cbe.get_transactions(date=date)
    
    for txn in transactions:
        if not db.payments.find_one({'ref': txn.external_id}):
            log_unmatched(txn)
            trigger_investigation(txn)
\`\`\`

## SLA Requirements
- 99.5% same-day reconciliation
- Maximum 0.1% unmatched transactions`,
    category: 'FinTech & Payment Gateways',
    authorId: '2',
    tags: ['cbe', 'bank', 'reconciliation', 'payments'],
    createdAt: '2025-03-15T09:00:00Z',
    updatedAt: '2025-04-18T11:00:00Z',
    views: 1234,
    likes: 112,
    status: 'published',
  },

  // Digital Infrastructure (1 article)
  {
    id: '6',
    title: 'Ethio Telecom API Rate Limiting & Failover',
    content: `# Ethio Telecom API Rate Limiting

## Current Limits
- SMS API: 500 requests/minute per client
- USSD API: 100 requests/minute per client
- Data Bundle API: 200 requests/minute per client

## Rate Limiter Implementation
\`\`\`typescript
class EthioTelecomRateLimiter {
  private queue: Map<string, number[]> = new Map();
  
  async throttle(endpoint: string): Promise<boolean> {
    const now = Date.now();
    const window = 60000; // 1 minute
    
    if (!this.queue.has(endpoint)) {
      this.queue.set(endpoint, []);
    }
    
    const timestamps = this.queue.get(endpoint)!.filter(
      t => now - t < window
    );
    
    if (timestamps.length >= this.getLimit(endpoint)) {
      return false; // Rate limited
    }
    
    timestamps.push(now);
    return true;
  }
}
\`\`\`

## Failover Strategy
When Ethio Telecom API is unavailable:
1. Switch to CBE SMS gateway (backup)
2. Queue messages for retry
3. Alert operations team`,
    category: 'Digital Infrastructure',
    authorId: '5',
    tags: ['ethio-telecom', 'rate-limiting', 'sms', 'failover'],
    createdAt: '2025-02-20T14:00:00Z',
    updatedAt: '2025-04-10T09:15:00Z',
    views: 876,
    likes: 89,
    status: 'published',
  },
];

export const mockInsightPosts: InsightPost[] = [
  {
    id: '1',
    authorId: '2',
    title: 'Telebirr API timeout after exactly 30 seconds',
    content: 'We discovered that the Telebirr sandbox environment times out after exactly 30 seconds. Production seems fine but we should add proper timeout handling for both.',
    type: 'Challenge',
    upvotes: 34,
    hasUpvoted: false,
    codeSnippet: `const timeout = setTimeout(() => {
  reject(new Error('Telebirr API timeout'));
}, 30000);`,
    language: 'typescript',
    isVerifiedSolution: true,
    comments: [
      { id: 'c1', authorId: '5', content: 'Confirmed on sandbox. Production has 60s timeout. We should align both environments.', createdAt: '2025-04-20T10:00:00Z' },
      { id: 'c2', authorId: '4', content: 'Added exponential backoff retry logic in the latest PR', createdAt: '2025-04-20T11:30:00Z' },
    ],
    createdAt: '2025-04-19T09:00:00Z',
  },
  {
    id: '2',
    authorId: '1',
    title: 'Kebele ID validation regex for new 10-digit format',
    content: 'The Ministry of Peace is rolling out a new 10-digit kebele ID format replacing the old 9-character format. I wrote a validation function that handles both.',
    type: 'Insight',
    upvotes: 28,
    hasUpvoted: false,
    codeSnippet: `function validateKebeleId(id: string): boolean {
  const legacyPattern = /^[A-Z]{3}-\\d{7}$/;
  const newPattern = /^\\d{10}$/;
  return legacyPattern.test(id) || newPattern.test(id);
}`,
    language: 'typescript',
    isVerifiedSolution: true,
    comments: [
      { id: 'c3', authorId: '2', content: 'Great work! We should add this to the shared utils package.', createdAt: '2025-04-21T08:00:00Z' },
    ],
    createdAt: '2025-04-20T14:30:00Z',
  },
  {
    id: '3',
    authorId: '5',
    title: 'Lesson Learned: Always use idempotency keys with CBE payments',
    content: 'We had a duplicate charge incident because our payment retry logic didn\'t include idempotency keys. CBE processed the same payment request twice. Now all payment requests include X-Idempotency-Key header.',
    type: 'Lesson Learned',
    upvotes: 41,
    hasUpvoted: false,
    codeSnippet: `headers: {
  'X-Idempotency-Key': \`payment-\${orderId}-\${Date.now()}\`,
  'X-API-Key': process.env.CBE_API_KEY
}`,
    language: 'typescript',
    isVerifiedSolution: true,
    comments: [],
    createdAt: '2025-04-18T16:00:00Z',
  },
  {
    id: '4',
    authorId: '6',
    title: 'Question: What\'s our SLA for E-Passport portal failures?',
    content: 'What\'s our contracted SLA with the E-Passport portal for downtime? I want to ensure our incident response times align with citizen expectations.',
    type: 'Question',
    upvotes: 12,
    hasUpvoted: false,
    isVerifiedSolution: false,
    comments: [
      { id: 'c5', authorId: '3', content: 'SLA is 99.5% uptime, 4-hour MTTR. Full document in Confluence under Procurement > Service Agreements.', createdAt: '2025-04-22T10:00:00Z' },
    ],
    createdAt: '2025-04-21T11:00:00Z',
  },
];

export const mockIssueTickets: IssueTicket[] = [
  {
    id: '1',
    title: 'Telebirr payment webhook not firing in production',
    description: 'Payment confirmations from Telebirr are not triggering webhooks in production. Customers are not receiving payment confirmations. Sandbox works fine.',
    status: 'Open',
    priority: 'Critical',
    category: 'FinTech',
    reportedById: '1',
    assignedToId: '5',
    createdAt: '2025-04-20T10:30:00Z',
    updatedAt: '2025-04-22T09:00:00Z',
    rootCause: 'Under investigation',
    preventativeMeasures: '',
    postMortemGenerated: false,
  },
  {
    id: '2',
    title: 'Ministry of Revenue e-Tax API returning 500 errors',
    description: 'The e-Tax portal API is returning intermittent 500 errors during business hours (9 AM - 12 PM). Affecting all taxpayer registration flows.',
    status: 'In Progress',
    priority: 'High',
    category: 'Government',
    reportedById: '2',
    assignedToId: '5',
    createdAt: '2025-04-19T14:00:00Z',
    updatedAt: '2025-04-22T11:30:00Z',
    rootCause: 'Database connection pool exhaustion',
    preventativeMeasures: 'Implement connection pooling and query optimization',
    postMortemGenerated: false,
  },
  {
    id: '3',
    title: 'Ethio Telecom SMS delivery delay exceeding 5 minutes',
    description: 'SMS messages sent via Ethio Telecom are experiencing 5-10 minute delays. Affecting OTP and notification delivery.',
    status: 'Resolved',
    priority: 'Medium',
    category: 'Infrastructure',
    reportedById: '1',
    assignedToId: '5',
    resolutionNotes: 'Root cause was network congestion during peak hours. Implemented SMS queuing with priority handling. Ethio Telecom confirmed infrastructure upgrade scheduled for next month.',
    createdAt: '2025-04-10T09:00:00Z',
    updatedAt: '2025-04-18T15:00:00Z',
    rootCause: 'Peak hour network congestion on Ethio Telecom side',
    preventativeMeasures: 'Implemented SMS queue with priority levels; scheduled retry for failed messages; monitoring dashboard created',
    postMortemGenerated: true,
  },
  {
    id: '4',
    title: 'Kebele ID format validation failing for Oromia region IDs',
    description: 'Oromia region kebele IDs have a different format than Addis Ababa. Current validation is rejecting valid Oromia IDs.',
    status: 'Open',
    priority: 'Medium',
    category: 'Integration',
    reportedById: '1',
    assignedToId: '2',
    createdAt: '2025-04-21T08:30:00Z',
    updatedAt: '2025-04-21T08:30:00Z',
    rootCause: 'Oromia uses region prefix OR followed by different number sequence',
    preventativeMeasures: '',
    postMortemGenerated: false,
  },
];

export const mockOffboardingRecords: OffboardingRecord[] = [
  {
    id: '1',
    employeeId: 'ex-1',
    employeeName: 'Meron Tadesse',
    department: 'Integration',
    lastWorkingDay: '2025-03-28',
    interviewDate: '2025-03-25',
    interviewerId: '3',
    unwrittenRules: 'The Ministry of Revenue staging environment credentials are stored in LastPass under "MOR-Staging-Legacy". Always test against staging before production - the production API keys rotate monthly on the 1st. The e-Tax team communicates via Telegram channel #etax-integration.',
    institutionalKnowledge: 'The e-Tax legacy SOAP endpoint will be deprecated December 2025. New REST endpoint is ready but requires ministry sign-off. Kebele ID API has a known issue where regional servers sync overnight - avoid critical integrations at 6 AM EAT.',
    keyContacts: [
      { name: 'Abraham Tesfaye', role: 'MOR Technical Lead', email: 'abraham.tesfaye@mora.gov.et', notes: 'Primary contact for e-Tax API issues' },
      { name: 'Fitsum Girma', role: 'Ministry Network Admin', email: 'fitsum.girma@moc.gov.et', phone: '+251-911-XXX-XXXX', notes: 'Only person who can whitelist IPs for ministry APIs' },
    ],
    processMapUrl: '/processes/ministry-api-onboarding',
    knowledgeTransferStatus: 'completed',
    exitInterviewNotes: 'Meron was instrumental in the Telebirr integration. Her walkthrough videos for payment gateway debugging are in Google Drive.',
    createdAt: '2025-03-25T10:00:00Z',
    digitalAssetsOwned: ['Telebirr API Production Keys', 'e-Tax SOAP Integration Module', 'CBE Payment Gateway v2.1'],
    walkthroughVideoUrl: 'https://drive.google.com/drive/meron-payment-debug',
  },
  {
    id: '2',
    employeeId: 'ex-2',
    employeeName: 'Kibret Solomon',
    department: 'DevOps',
    lastWorkingDay: '2025-04-15',
    interviewDate: '2025-04-10',
    interviewerId: '3',
    unwrittenRules: 'Ethio Telecom production credentials rotate quarterly - next rotation is June 1st. The AWS Ethiopia region (af-east-1) has different IAM policies than global. Kubernetes cluster upgrade nights are every other Thursday after 10 PM EAT.',
    institutionalKnowledge: 'The backup scripts for Ministry of Revenue data run via cron on the db-backup server. The Telebirr gateway monitoring is done through Datadog dashboard "Telebirr Health v2". Prometheus alerts fire to #ops-alerts Slack channel.',
    keyContacts: [
      { name: 'Frehiwot Worku', role: 'DevOps Lead', email: 'frehiwot.worku@a-mesob.et', notes: 'Primary ops contact' },
      { name: 'Yonas Mesfin', role: 'Ethio Telecom B2B Support', email: 'b2b@ethiotelecom.et', phone: '+251-11-XXX-XXXX', notes: 'Escalation for SMS/USSD issues' },
    ],
    knowledgeTransferStatus: 'in-progress',
    exitInterviewNotes: 'Exit interview scheduled for April 10. Knowledge transfer session scheduled for April 12. All AWS credentials to be rotated April 16.',
    createdAt: '2025-04-10T14:00:00Z',
    digitalAssetsOwned: ['AWS Root Account (emergency only)', 'Kubernetes Admin Config', 'Ethio Telecom Production Credentials', 'Datadog Admin Access'],
  },
];

export const mockLearningPathways: LearningPathway[] = [
  {
    id: '1',
    title: 'Government API Integration Fundamentals',
    description: 'Master integration with Ethiopian government ministry APIs including Kebele ID, e-Tax, and E-Passport.',
    category: 'Integration',
    modules: [
      { id: 'm1', title: 'Understanding Ethiopian Government Systems', description: 'Overview of ministry structure and API ecosystems', duration: '2 hours', order: 1 },
      { id: 'm2', title: 'REST API Best Practices', description: 'Authentication, rate limiting, and error handling', duration: '3 hours', order: 2 },
      { id: 'm3', title: 'Kebele ID Integration', description: 'Real-time citizen identity verification', duration: '4 hours', order: 3 },
      { id: 'm4', title: 'e-Tax Portal Integration', description: 'Taxpayer registration and compliance APIs', duration: '3 hours', order: 4 },
      { id: 'm5', title: 'E-Passport API Integration', description: 'Passport application and status tracking', duration: '2 hours', order: 5 },
    ],
    requiredForRoles: ['junior'],
    progress: 'in-progress',
    enrolledAt: '2025-04-01',
  },
  {
    id: '2',
    title: 'FinTech Payment Gateway Integration',
    description: 'Learn to integrate Telebirr, CBE, and commercial bank payment systems.',
    category: 'FinTech',
    modules: [
      { id: 'm6', title: 'Telebirr API Deep Dive', description: 'Mobile money payment integration patterns', duration: '4 hours', order: 1 },
      { id: 'm7', title: 'Bank Reconciliation', description: 'Payment matching and dispute resolution', duration: '3 hours', order: 2 },
      { id: 'm8', title: 'Idempotency & Security', description: 'Preventing duplicate charges and fraud', duration: '2 hours', order: 3 },
    ],
    requiredForRoles: ['junior'],
    progress: 'not-started',
  },
  {
    id: '3',
    title: 'DevOps & Infrastructure Excellence',
    description: 'Skills for managing Ethiopian digital infrastructure.',
    category: 'DevOps',
    modules: [
      { id: 'm9', title: 'AWS Ethiopia Region Operations', description: 'Managing infrastructure on af-east-1', duration: '3 hours', order: 1 },
      { id: 'm10', title: 'Ethio Telecom Integration', description: 'SMS, USSD, and connectivity management', duration: '4 hours', order: 2 },
      { id: 'm11', title: 'Incident Response Playbooks', description: 'Government service outage handling', duration: '2 hours', order: 3 },
      { id: 'm12', title: 'Post-Mortem Writing', description: 'Creating effective post-mortem documentation', duration: '2 hours', order: 4 },
    ],
    requiredForRoles: ['senior'],
    progress: 'completed',
    completedAt: '2025-03-15',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'warning',
    title: 'Telebirr webhook issue',
    message: 'Production webhook failures detected - investigating root cause',
    read: false,
    createdAt: '2025-04-22T09:00:00Z',
    link: '/issues',
  },
  {
    id: 'n2',
    type: 'info',
    title: 'New article published',
    message: 'Daniel published "Ministry of Revenue e-Tax Portal Data Migration"',
    read: false,
    createdAt: '2025-04-22T08:00:00Z',
    link: '/knowledge-base',
  },
  {
    id: 'n3',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Samuel mentioned you in "Kebele ID validation" discussion',
    read: false,
    createdAt: '2025-04-21T14:30:00Z',
    link: '/community',
  },
  {
    id: 'n4',
    type: 'success',
    title: 'Skill completed',
    message: 'You completed "REST API Best Practices" module',
    read: true,
    createdAt: '2025-04-20T16:00:00Z',
    link: '/learning',
  },
];

export const mockQMSFeedback: QMSFeedback[] = [
  {
    id: 'qms-1',
    source: 'E-Passport Portal',
    citizenFailureRate: 23.5,
    issueDescription: 'Citizens repeatedly failing photo upload due to unclear size requirements and timezone confusion on appointment scheduling.',
    knowledgeGapTicketId: 'KB-1',
    createdAt: '2025-04-20T10:00:00Z',
  },
  {
    id: 'qms-2',
    source: 'Telebirr Gateway',
    citizenFailureRate: 8.2,
    issueDescription: 'Payment timeout messages are confusing. Citizens don\'t understand if payment failed or is pending.',
    createdAt: '2025-04-19T14:00:00Z',
  },
  {
    id: 'qms-3',
    source: 'Ministry of Revenue e-Tax',
    citizenFailureRate: 31.0,
    issueDescription: 'High failure rate on TIN validation. Legacy TINs have inconsistent formats across regions.',
    knowledgeGapTicketId: 'ticket-2',
    createdAt: '2025-04-18T09:00:00Z',
  },
];
