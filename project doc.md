# A-Mesob KMS - Knowledge Management System

A modern web application for A-Mesob Service Center, an Ethiopian government services organization. This system addresses "brain drain" by preserving tacit knowledge through structured knowledge management.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [User Roles & Permissions](#user-roles--permissions)
- [User Directory](#user-directory)
- [Pages & Features](#pages--features)
- [Components Architecture](#components-architecture)
- [Data Models](#data-models)
- [State Management](#state-management)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)

---

## Project Overview

**Purpose:** Preserve institutional knowledge and prevent "brain drain" by creating a centralized system for:
- Documenting policies, procedures, and best practices
- Sharing insights and lessons learned
- Tracking and resolving operational issues
- Managing employee skill development
- Documenting exit workflows and knowledge transfer

**Demo Mode:** The application includes a Demo Mode role switcher to test different user perspectives (Junior, Senior, Admin).

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | State management with persistence |
| TipTap | Rich text editor for articles |
| React | UI library |

**Package Manager:** pnpm

---

## User Roles & Permissions

The system implements **Role-Based Access Control (RBAC)** with three roles:

### Role Definitions

| Role | Description | Badge Color |
|------|-------------|-------------|
| **Junior** | Entry-level employees | Green |
| **Senior** | Team leads and experienced staff | Blue |
| **Admin** | HR and system administrators | Purple |

### Permission Matrix

| Feature | Junior | Senior | Admin |
|---------|:------:|:------:|:-----:|
| View Knowledge Base | ✅ Read | ✅ Read | ✅ Read/Write |
| Create KB Articles | ❌ | ✅ | ✅ |
| Edit KB Articles | ❌ | ✅ | ✅ |
| Approve/Reject Skills | ❌ | ✅ | ✅ |
| Create Community Posts | ✅ | ✅ | ✅ |
| Comment on Posts | ✅ | ✅ | ✅ |
| Submit Issue Tickets | ✅ | ✅ | ✅ |
| Update Ticket Status | ❌ | ✅ | ✅ |
| Convert to KB Article | ❌ | ✅ | ✅ |
| View Exit Workflows | ❌ | ❌ | ✅ |
| Manage Exit Processes | ❌ | ❌ | ✅ |
| Access Admin Panel | ❌ | ❌ | ✅ |
| View Team Progress | ❌ | ✅ | ✅ |

---

## User Directory

The system includes 6 mock users representing different roles and departments:

### 1. Bethel Haile (Junior Employee)
- **ID:** `1`
- **Email:** bethel.haile@a-mesob.et
- **Department:** Customer Service
- **Join Date:** 2025-03-15
- **Supervisor:** Daniel Kebede
- **Bio:** Passionate about delivering excellent public service to Ethiopian citizens
- **Completed Skills:** Customer Service Fundamentals, Digital Signage Operations

### 2. Daniel Kebede (Senior / Team Lead)
- **ID:** `2`
- **Email:** daniel.kebede@a-mesob.et
- **Department:** Operations
- **Join Date:** 2023-08-01
- **Bio:** Operations specialist with 5+ years experience in government service delivery
- **Completed Skills:** Team Leadership, Process Optimization, Training & Mentorship, Incident Management

### 3. Tigist Alemu (Admin / HR Lead)
- **ID:** `3`
- **Email:** tigist.alemu@a-mesob.et
- **Department:** HR
- **Join Date:** 2022-01-10
- **Bio:** HR Lead dedicated to preserving institutional knowledge and employee growth
- **Completed Skills:** HR Management, Knowledge Management, Offboarding Processes, Policy Development

### 4. Samuel Teshome (Junior Employee)
- **ID:** `4`
- **Email:** samuel.teshome@a-mesob.et
- **Department:** IT
- **Join Date:** 2025-01-20
- **Supervisor:** Frehiwot Worku
- **Completed Skills:** System Administration

### 5. Frehiwot Worku (Senior / IT Manager)
- **ID:** `5`
- **Email:** frehiwot.worku@a-mesob.et
- **Department:** IT
- **Join Date:** 2021-06-15
- **Bio:** IT Manager ensuring seamless digital operations for government services
- **Completed Skills:** Infrastructure Management, Security Auditing, Vendor Management

### 6. Abebe Girma (Senior / QA Lead)
- **ID:** `6`
- **Email:** abebe.girma@a-mesob.et
- **Department:** Quality Assurance
- **Join Date:** 2020-11-01
- **Bio:** Quality assurance expert focused on citizen satisfaction metrics
- **Completed Skills:** Quality Standards, Process Auditing, Performance Metrics

---

## Pages & Features

### 1. Dashboard (`/`)

**Purpose:** Central hub displaying overview metrics and quick actions.

**Features:**
- **Stats Cards:** Display aggregate numbers for Knowledge Articles, Active Issues, Team Members, Learning Pathways
- **Recent Activity Feed:** Shows latest actions (new articles, resolved issues, completed learning)
- **Quick Actions Grid:** Links to Submit Issue, New Article, Start Learning, Community
- **Knowledge Retention Initiative Banner:** Promotes the KMS mission
- **Demo Mode Role Switcher:** Allows testing different user perspectives

**Access:** All users

---

### 2. Knowledge Base (`/knowledge-base`)

**Purpose:** Centralized repository for policies, procedures, and best practices.

**Features:**
- **Category Filtering:** HR Policies, IT Procedures, Quality Guidelines
- **Search:** Full-text search across titles, content, and tags
- **Article Cards:** Display title, category badge, status (draft/published), author, views, likes
- **Article Viewer:** Full article display with metadata (author, date, views, tags)
- **Create Article Modal:** TipTap rich text editor for creating/editing articles
- **Read-Only Indicator:** Shows for junior users

**Article Categories:**
| Category | Color | Description |
|----------|-------|-------------|
| HR Policies | Red | Employee policies, leave, performance reviews |
| IT Procedures | Blue | Technical procedures, security, troubleshooting |
| Quality Guidelines | Green | Service standards, KPIs, escalation procedures |

**Article Status:**
- `draft` - Not visible to junior employees
- `published` - Visible to all users
- `archived` - Hidden from listings

**Permissions:**
| Action | Junior | Senior | Admin |
|--------|:------:|:------:|:-----:|
| View Published Articles | ✅ | ✅ | ✅ |
| View Draft Articles | ❌ | ✅ | ✅ |
| Create Articles | ❌ | ✅ | ✅ |
| Edit Articles | ❌ | ✅ | ✅ |

**Mock Articles:**
1. "Employee Leave Policy - 2025 Update" (HR Policies, 1245 views)
2. "Performance Review Guidelines & Career Progression" (HR Policies, 678 views)
3. "IT Security Password Reset Protocol" (IT Procedures, 891 views)
4. "A-Mesob Automated Workflow Troubleshooting" (IT Procedures, 567 views)
5. "Customer Service Escalation Procedures" (Quality Guidelines, 342 views)
6. "Service Quality Standards & Citizen Satisfaction Metrics" (Quality Guidelines, 445 views)

---

### 3. Community Board (`/community`)

**Purpose:** Social platform for sharing insights, challenges, and lessons learned.

**Features:**
- **Create Post:** Share insights with title, content, and type
- **Post Type Filters:** All, Insights, Challenges, Lessons Learned, Questions
- **Insight Cards:** Display author, type badge, content, upvotes, comments
- **Upvote System:** Toggle upvotes on posts
- **Comment System:** Add comments to any post

**Post Types:**
| Type | Emoji | Purpose |
|------|-------|---------|
| Insight | 💡 | Best practices and successful strategies |
| Challenge | ⚠️ | Problems seeking solutions |
| Lesson Learned | 📘 | Insights gained from experiences |
| Question | ❓ | Questions to the community |

**Mock Posts:**
1. "Morning Rush Hour Strategy That Reduced Wait Times by 40%" - Daniel K. (34 upvotes)
2. "Challenge: Elderly Customers Struggling with Self-Service Kiosks" - Bethel H. (28 upvotes)
3. "Lesson Learned: Always Verify Document Scanners Daily" - Frehiwot W. (41 upvotes)
4. "Question: Standard Resolution Time for Quality Complaints?" - Abebe G. (12 upvotes)

**Access:** All users can create posts and comments

---

### 4. Issue Logs (`/issues`)

**Purpose:** Kanban-style board for tracking and resolving operational issues.

**Features:**
- **Kanban Board:** Three columns - Open, In Progress, Resolved
- **New Issue Form:** Submit tickets with title, description, category, priority
- **Ticket Cards:** Display priority badge, title, description, category, date
- **Ticket Detail Modal:** Full ticket view with activity timeline
- **Convert to KB Article:** Senior/Admin can convert resolved tickets to knowledge articles
- **Comment Thread:** Add comments to tickets

**Priority Levels:**
| Priority | Color | Use Case |
|----------|-------|----------|
| Low | Gray | Minor inconveniences |
| Medium | Blue | Standard issues |
| High | Amber | Urgent but not critical |
| Critical | Red | Service-breaking issues |

**Categories:**
- IT (technical issues)
- Equipment (hardware problems)
- Process (workflow issues)
- Facilities (building/environment)
- Other

**Mock Tickets:**
1. "Authentication timeout errors during peak hours" - Open, High, IT (assigned to Frehiwot)
2. "Missing signature field on business registration form" - In Progress, Critical, Process
3. "Printer paper jam in Window 3" - Resolved, Medium, Equipment
4. "Waiting area temperature too cold in mornings" - Open, Low, Facilities

**Permissions:**
| Action | Junior | Senior | Admin |
|--------|:------:|:------:|:-----:|
| Submit Tickets | ✅ | ✅ | ✅ |
| Update Ticket Status | ❌ | ✅ | ✅ |
| Add Comments | ✅ | ✅ | ✅ |
| Convert to KB Article | ❌ | ✅ | ✅ |

---

### 5. Learning Pathways (`/learning`)

**Purpose:** Track employee skill development and career progression.

**Features:**
- **Progress Dashboard:** Visual progress bar showing completion percentage
- **Skill Phases:** Four phases representing career progression stages
- **Skill Nodes:** Individual skills with completion status
- **Team Progress Tab (Senior/Admin only):** View junior employees' progress
- **Skill Approval System:** Senior/Admin can approve skills requiring validation

**Skill Phases:**
| Phase | Color | Description |
|-------|-------|-------------|
| HR Orientation | Blue | Company culture, policies, basics |
| Departmental Training | Purple | Department-specific workflows |
| Supervised Tasks | Amber | Tasks requiring supervisor approval |
| Independent Execution | Green | Full autonomy, mentoring others |

**Sample Skills:**
- HR Orientation: Company Culture & Values, Code of Conduct, Leave & Benefits Policy, IT Security Basics
- Departmental Training: Department Workflow, Service Delivery Standards, Documentation Requirements
- Supervised Tasks: Basic Service Tasks, Customer Interaction, System Navigation
- Independent Execution: Full Service Delivery, Complex Problem Solving, Quality Assurance, Knowledge Sharing

**Permissions:**
| Feature | Junior | Senior | Admin |
|---------|:------:|:------:|:-----:|
| View Own Progress | ✅ | ✅ | ✅ |
| Complete Self-Service Skills | ✅ | ✅ | ✅ |
| View Team Progress | ❌ | ✅ | ✅ |
| Approve Skills | ❌ | ✅ | ✅ |

---

### 6. Admin Panel (`/admin`)

**Purpose:** System administration and user management.

**Features:**
- **Stats Dashboard:** System-wide metrics
- **User Management:** View and manage user accounts
- **Role Management:** Assign/modify user roles
- **Activity Logs:** Track system usage

**Access:** Admin only (RBAC protected)

---

### 7. Exit Workflows (`/exit-workflows`)

**Purpose:** Document knowledge transfer when employees leave the organization.

**Features:**
- **Exit Wizard:** Multi-step process for documenting offboarding
- **Step 1 - Experience Documentation:** Record unwritten rules and institutional knowledge
- **Step 2 - Process Mapping:** Document critical workflows
- **Step 3 - Review:** Final review before completion
- **Records List:** View past exit records
- **Search:** Find specific records

**Exit Record Fields:**
- Employee Name & ID
- Department
- Last Working Day
- Interview Date
- Unwritten Rules (tacit knowledge)
- Institutional Knowledge
- Key Contacts (with role, email, phone, notes)
- Process Map URL
- Knowledge Transfer Status (pending, in-progress, completed)
- Exit Interview Notes

**Mock Records:**
1. Meron Tadesse (Customer Service) - Status: completed
2. Kibret Solomon (IT) - Status: in-progress

**Access:** Admin only (RBAC protected)

---

## Components Architecture

### Layout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `AppShell` | `components/layout/` | Main layout wrapper with navbar, sidebar, footer |
| `TopNavbar` | `components/layout/` | Header with logo, search, notifications, user dropdown |
| `LeftSidebar` | `components/layout/` | Collapsible navigation sidebar |

### Feature Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `RoleSwitcher` | `components/` | Demo mode role toggle |
| `ArticleEditorModal` | `components/knowledge/` | TipTap rich text editor for articles |
| `InsightCard` | `components/community/` | Community post display |
| `CreatePost` | `components/community/` | Post creation form |
| `IssueCard` | `components/issues/` | Kanban ticket card |
| `TicketDetailModal` | `components/issues/` | Full ticket view with comments |
| `SkillPhase` | `components/learning/` | Learning phase with skills |
| `SkillNode` | `components/learning/` | Individual skill item |

### Key Implementation Notes

1. **TipTap Editor:** Uses `immediatelyRender: false` to avoid SSR hydration errors
2. **Search Params:** `useSearchParams()` wrapped in `<Suspense>` boundary
3. **Auth Context:** Uses `user` property (not `currentUser`)
4. **Zustand Store:** Persists `currentUser` to localStorage

---

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'junior' | 'senior' | 'admin';
  department: string;
  joinDate: string;
  avatar?: string;
  technicalSkills: Skill[];
  supervisorId?: string;
  bio?: string;
}
```

### KnowledgeArticle
```typescript
interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: ArticleCategory;
  authorId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  status: 'draft' | 'published' | 'archived';
}
```

### InsightPost
```typescript
interface InsightPost {
  id: string;
  authorId: string;
  content: string;
  type: 'Insight' | 'Challenge' | 'Lesson Learned' | 'Question';
  title: string;
  upvotes: number;
  hasUpvoted: boolean;
  comments: Comment[];
  createdAt: string;
}
```

### IssueTicket
```typescript
interface IssueTicket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  reportedById: string;
  assignedToId?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### OffboardingRecord
```typescript
interface OffboardingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  lastWorkingDay: string;
  interviewDate: string;
  interviewerId: string;
  unwrittenRules: string;
  institutionalKnowledge: string;
  keyContacts: KeyContact[];
  processMapUrl?: string;
  knowledgeTransferStatus: 'pending' | 'in-progress' | 'completed';
  exitInterviewNotes?: string;
  createdAt: string;
}
```

### LearningPathway
```typescript
interface LearningPathway {
  id: string;
  title: string;
  description: string;
  category: string;
  modules: LearningModule[];
  requiredForRoles: UserRole[];
  progress?: 'not-started' | 'in-progress' | 'completed';
  enrolledAt?: string;
  completedAt?: string;
}
```

---

## State Management

Uses **Zustand** with localStorage persistence.

### Store Structure
```typescript
interface AppState {
  // User State
  currentUser: User | null;
  users: User[];
  
  // Data Collections
  articles: KnowledgeArticle[];
  insightPosts: InsightPost[];
  issueTickets: IssueTicket[];
  offboardingRecords: OffboardingRecord[];
  learningPathways: LearningPathway[];
  notifications: Notification[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  
  // Article Actions
  addArticle: (article) => void;
  updateArticle: (id, updates) => void;
  deleteArticle: (id) => void;
  
  // Community Actions
  addInsightPost: (post) => void;
  toggleUpvote: (postId) => void;
  addComment: (postId, content) => void;
  
  // Issue Actions
  addIssueTicket: (ticket) => void;
  updateTicketStatus: (id, status, resolutionNotes?) => void;
  
  // Offboarding Actions
  addOffboardingRecord: (record) => void;
  updateOffboardingStatus: (id, status) => void;
  
  // Notification Actions
  markNotificationRead: (id) => void;
  markAllNotificationsRead: () => void;
  
  // Learning Actions
  enrollInPathway: (pathwayId) => void;
  completeModule: (pathwayId, moduleId) => void;
}
```

### Persistence
- Only `currentUser` is persisted to localStorage
- Storage key: `a-mesob-kms-storage`

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm package manager

### Installation
```bash
cd a-mesob-kms
pnpm install
```

### Development
```bash
pnpm dev
```

### Build
```bash
pnpm build
```

### Lint
```bash
pnpm lint
```

---

## Development Guidelines

### Code Style
- Use functional components with hooks
- Prefer `const` over `let`
- Use TypeScript interfaces for type definitions
- Follow existing naming conventions

### Component Patterns
1. **Client Components:** All page components use `'use client'` directive
2. **Auth Access:** Use `useAuth()` hook for user/role checks
3. **Store Access:** Use `useAppStore()` for state management
4. **Search Params:** Wrap `useSearchParams()` in `<Suspense>` boundaries

### Common Patterns

**Checking Permissions:**
```typescript
const { isAdmin, isSenior, isJunior } = useAuth();
```

**Accessing Current User:**
```typescript
const { user } = useAuth();
```

**Accessing Store Data:**
```typescript
const { articles, insightPosts } = useAppStore();
```

**Protected Routes (Admin only):**
```typescript
if (!isAdmin) {
  return <AccessDenied />;
}
```

---

## File Structure

```
a-mesob-kms/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Dashboard
│   │   ├── layout.tsx            # Root layout with AuthProvider
│   │   ├── community/page.tsx     # Community Board
│   │   ├── knowledge-base/page.tsx # Knowledge Base
│   │   ├── issues/page.tsx        # Issue Logs Kanban
│   │   ├── learning/page.tsx       # Learning Pathways
│   │   ├── admin/page.tsx         # Admin Panel
│   │   └── exit-workflows/page.tsx # Exit Workflows
│   ├── components/
│   │   ├── layout/                # Layout components
│   │   ├── knowledge/             # Knowledge Base components
│   │   ├── community/            # Community components
│   │   ├── issues/               # Issue components
│   │   ├── learning/             # Learning components
│   │   └── RoleSwitcher.tsx      # Demo mode toggle
│   ├── context/
│   │   └── AuthContext.tsx        # Auth provider
│   ├── lib/
│   │   ├── store.ts               # Zustand store
│   │   └── data.ts               # Mock data
│   └── types/
│       └── index.ts               # TypeScript types
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## Known Technical Notes

1. **@ Alias:** The `@/` path alias is configured in `tsconfig.json` and works correctly
2. **TipTap SSR:** Requires `immediatelyRender: false` in editor configuration
3. **Next.js Suspense:** `useSearchParams()` requires wrapping in Suspense boundary
4. **AuthContext:** Uses `user` property (not `currentUser`)
5. **Package Manager:** Uses `pnpm` (not npm/yarn)

---

## TODO / Future Improvements

- [ ] Complete Amharic text removal (found in RoleSwitcher, Learning page, AppShell)
- [ ] Create Admin page (`/admin`)
- [ ] Create Exit Workflows page (`/exit-workflows`)
- [ ] Add authentication system (currently using mock users)
- [ ] Add API endpoints for backend integration
- [ ] Add unit tests
- [ ] Add E2E tests with Playwright
- [ ] Implement notification system
- [ ] Add more mock data for realistic demo
