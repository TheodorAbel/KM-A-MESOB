import { User, KnowledgeArticle, InsightPost, IssueTicket, OffboardingRecord, LearningPathway, Notification } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Bethel Haile',
    email: 'bethel.haile@a-mesob.et',
    role: 'junior',
    department: 'Customer Service',
    joinDate: '2025-03-15',
    avatar: 'BH',
    technicalSkills: [
      { name: 'Customer Service Fundamentals', completed: true, completedAt: '2025-04-10' },
      { name: 'Digital Signage Operations', completed: true, completedAt: '2025-04-25' },
      { name: 'Document Authentication', completed: false },
      { name: 'Conflict Resolution', completed: false },
    ],
    supervisorId: '2',
    bio: 'Passionate about delivering excellent public service to Ethiopian citizens.',
  },
  {
    id: '2',
    name: 'Daniel Kebede',
    email: 'daniel.kebede@a-mesob.et',
    role: 'senior',
    department: 'Operations',
    joinDate: '2023-08-01',
    avatar: 'DK',
    technicalSkills: [
      { name: 'Team Leadership', completed: true },
      { name: 'Process Optimization', completed: true },
      { name: 'Training & Mentorship', completed: true },
      { name: 'Incident Management', completed: true },
    ],
    bio: 'Operations specialist with 5+ years experience in government service delivery.',
  },
  {
    id: '3',
    name: 'Tigist Alemu',
    email: 'tigist.alemu@a-mesob.et',
    role: 'admin',
    department: 'HR',
    joinDate: '2022-01-10',
    avatar: 'TA',
    technicalSkills: [
      { name: 'HR Management', completed: true },
      { name: 'Knowledge Management', completed: true },
      { name: 'Offboarding Processes', completed: true },
      { name: 'Policy Development', completed: true },
    ],
    bio: 'HR Lead dedicated to preserving institutional knowledge and employee growth.',
  },
  {
    id: '4',
    name: 'Samuel Teshome',
    email: 'samuel.teshome@a-mesob.et',
    role: 'junior',
    department: 'IT',
    joinDate: '2025-01-20',
    avatar: 'ST',
    technicalSkills: [
      { name: 'System Administration', completed: true, completedAt: '2025-02-15' },
      { name: 'Network Troubleshooting', completed: false },
      { name: 'Security Protocols', completed: false },
    ],
    supervisorId: '5',
  },
  {
    id: '5',
    name: 'Frehiwot Worku',
    email: 'frehiwot.worku@a-mesob.et',
    role: 'senior',
    department: 'IT',
    joinDate: '2021-06-15',
    avatar: 'FW',
    technicalSkills: [
      { name: 'Infrastructure Management', completed: true },
      { name: 'Security Auditing', completed: true },
      { name: 'Vendor Management', completed: true },
    ],
    bio: 'IT Manager ensuring seamless digital operations for government services.',
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
      { name: 'Quality Standards', completed: true },
      { name: 'Process Auditing', completed: true },
      { name: 'Performance Metrics', completed: true },
    ],
    bio: 'Quality assurance expert focused on citizen satisfaction metrics.',
  },
];

export const mockArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'Customer Service Escalation Procedures',
    content: '# Escalation Procedures\n\n## When to Escalate\n\nAlways escalate when:\n- Customer is dissatisfied after initial resolution attempt\n- Issue requires special authorization\n- Customer requests to speak with a supervisor\n- Problem affects multiple customers\n\n## Escalation Levels\n\n### Level 1: Team Lead\nFirst point of escalation for team-related issues.\n\n### Level 2: Department Manager  \nHandles cross-department conflicts.\n\n### Level 3: Operations Director\nComplex issues requiring resource allocation.\n\n## Documentation\nAll escalations must be logged in the Issue Tracking System within 15 minutes.',
    category: 'Quality Guidelines',
    authorId: '2',
    tags: ['customer-service', 'escalation', 'procedures'],
    createdAt: '2025-03-15T10:30:00Z',
    updatedAt: '2025-04-20T14:22:00Z',
    views: 342,
    likes: 28,
    status: 'published',
  },
  {
    id: '2',
    title: 'New Business Registration - Step by Step Guide',
    content: '# New Business Registration Process\n\n## Prerequisites\n- TIN Number\n- Business Name Registration Certificate\n- Commercial Registration\n\n## Step 1: Document Verification\nVerify all submitted documents against original copies.\n\n## Step 2: System Entry\nEnter business details into the registration portal.\n\n## Step 3: Fee Collection\nCollect appropriate service fees.\n\n## Step 4: Processing Timeline\n- Normal: 3 business days\n- Express: Same day (with additional fee)',
    category: 'Process Documentation',
    authorId: '6',
    tags: ['business', 'registration', 'step-by-step'],
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-04-18T11:45:00Z',
    views: 567,
    likes: 45,
    status: 'published',
  },
];

export const mockInsightPosts: InsightPost[] = [
  {
    id: '1',
    authorId: '2',
    title: 'Morning Rush Hour Strategy That Reduced Wait Times by 40%',
    content: 'We implemented a ticket-based queue system during peak hours (9-11 AM). Instead of first-come-first-served, we now prioritize by document complexity. Simple renewals go to express lane, complex registrations to standard lane. Results: Average wait dropped from 45 min to 27 min.',
    type: 'Insight',
    upvotes: 34,
    hasUpvoted: false,
    comments: [
      { id: 'c1', authorId: '3', content: 'Great initiative! Can you share the training materials used?', createdAt: '2025-04-20T10:00:00Z' },
      { id: 'c2', authorId: '1', content: 'This has helped me so much during my shifts!', createdAt: '2025-04-20T11:30:00Z' },
    ],
    createdAt: '2025-04-19T09:00:00Z',
  },
  {
    id: '2',
    authorId: '1',
    title: 'Challenge: Elderly Customers Struggling with Self-Service Kiosks',
    content: 'Many elderly citizens come in without family support and struggle with the digital kiosks. They often give up or take very long. I end up helping them manually which creates bottlenecks. Would appreciate any creative solutions or additional kiosk assistance protocols.',
    type: 'Challenge',
    upvotes: 28,
    hasUpvoted: false,
    comments: [
      { id: 'c3', authorId: '2', content: 'We are piloting a "digital assistant" program - senior employees can volunteer as kiosk guides during peak hours.', createdAt: '2025-04-21T08:00:00Z' },
      { id: 'c4', authorId: '6', content: 'Adding this to the next quality improvement meeting agenda.', createdAt: '2025-04-21T09:15:00Z' },
    ],
    createdAt: '2025-04-20T14:30:00Z',
  },
  {
    id: '3',
    authorId: '5',
    title: 'Lesson Learned: Always Verify Document Scanners Daily',
    content: 'We had a scanner malfunction go unnoticed for 2 days, resulting in 47 documents that needed rescanning. Now we have a mandatory daily scanner check at shift start. Takes 2 minutes, saves hours of rework.',
    type: 'Lesson Learned',
    upvotes: 41,
    hasUpvoted: false,
    comments: [],
    createdAt: '2025-04-18T16:00:00Z',
  },
];

export const mockIssueTickets: IssueTicket[] = [
  {
    id: '1',
    title: 'Authentication timeout errors during peak hours',
    description: 'Multiple customers experiencing session timeouts during 10-12 PM rush.',
    status: 'Open',
    priority: 'High',
    category: 'IT',
    reportedById: '1',
    assignedToId: '5',
    createdAt: '2025-04-20T10:30:00Z',
    updatedAt: '2025-04-22T09:00:00Z',
  },
];

export const mockOffboardingRecords: OffboardingRecord[] = [
  {
    id: '1',
    employeeId: 'ex-1',
    employeeName: 'Meron Tadesse',
    department: 'Customer Service',
    lastWorkingDay: '2025-03-28',
    interviewDate: '2025-03-25',
    interviewerId: '3',
    unwrittenRules: 'Morning briefings set the tone for the day.',
    institutionalKnowledge: 'The key to handling angry customers is to never match their energy.',
    keyContacts: [
      { name: 'Daniel Kebede', role: 'Operations Lead', email: 'daniel.kebede@a-mesob.et' },
    ],
    knowledgeTransferStatus: 'completed',
    createdAt: '2025-03-25T10:00:00Z',
  },
];

export const mockLearningPathways: LearningPathway[] = [
  {
    id: '1',
    title: 'Customer Service Excellence',
    description: 'Master the fundamentals of delivering exceptional government service.',
    category: 'Customer Service',
    modules: [
      { id: 'm1', title: 'Introduction to Public Service', description: 'Understanding our mission', duration: '1 hour', order: 1 },
      { id: 'm2', title: 'Citizen Interaction Basics', description: 'First impressions and communication', duration: '2 hours', order: 2 },
    ],
    requiredForRoles: ['junior'],
    progress: 'in-progress',
    enrolledAt: '2025-04-01',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'info',
    title: 'New article published',
    message: 'Daniel published "Morning Rush Hour Strategy"',
    read: false,
    createdAt: '2025-04-22T09:00:00Z',
  },
  {
    id: 'n2',
    type: 'warning',
    title: 'Issue requires attention',
    message: 'Authentication timeout errors ticket is still open',
    read: false,
    createdAt: '2025-04-22T08:00:00Z',
  },
];
