export type UserRole = 'junior' | 'senior' | 'admin';
export type Department = 'Integration' | 'DevOps' | 'Security' | 'Product' | 'Finance' | 'Quality Assurance';

export interface Skill {
  name: string;
  completed: boolean;
  completedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  joinDate: string;
  avatar?: string;
  technicalSkills: Skill[];
  supervisorId?: string;
  bio?: string;
}

export type ArticleCategory = 'Government Integrations' | 'FinTech & Payment Gateways' | 'Digital Infrastructure';

export type ArticleLifecycle = 'draft' | 'review' | 'published' | 'archived' | 'retired';

export interface ArticleVersion {
  id: string;
  articleId: string;
  version: number;
  content: string;
  editedBy: string;
  editedAt: string;
  changeNote?: string;
}

export interface ArticleFeedback {
  id: string;
  articleId: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: ArticleCategory;
  authorId: string;
  ownerId?: string;
  tags: string[];
  relatedArticles: string[];
  createdAt: string;
  updatedAt: string;
  lastReviewedAt?: string;
  views: number;
  likes: number;
  status: ArticleLifecycle;
  needsVerification?: boolean;
  flaggedBy?: string;
  flaggedAt?: string;
  versions: ArticleVersion[];
  feedback: ArticleFeedback[];
  searchTerms: string[];
}

export type InsightType = 'Insight' | 'Challenge' | 'Lesson Learned' | 'Question';

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  isVerified?: boolean;
}

export interface InsightPost {
  id: string;
  authorId: string;
  content: string;
  type: InsightType;
  title: string;
  upvotes: number;
  hasUpvoted: boolean;
  comments: Comment[];
  createdAt: string;
  codeSnippet?: string;
  language?: string;
  isVerifiedSolution: boolean;
  verifiedCommentId?: string;
}

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface IssueTicket {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  category: string;
  reportedById: string;
  assignedToId?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
  rootCause?: string;
  preventativeMeasures?: string;
  postMortemGenerated: boolean;
}

export interface KeyContact {
  name: string;
  role: string;
  email: string;
  phone?: string;
  notes?: string;
}

export interface OffboardingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
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
  digitalAssetsOwned: string[];
  walkthroughVideoUrl?: string;
}

export type LearningPathwayStatus = 'not-started' | 'in-progress' | 'completed';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
}

export interface LearningPathway {
  id: string;
  title: string;
  description: string;
  category: string;
  modules: LearningModule[];
  requiredForRoles: UserRole[];
  progress?: LearningPathwayStatus;
  enrolledAt?: string;
  completedAt?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'mention';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface QMSFeedback {
  id: string;
  source: string;
  citizenFailureRate: number;
  issueDescription: string;
  knowledgeGapTicketId?: string;
  createdAt: string;
}

export interface ShadowRequest {
  id: string;
  juniorId: string;
  seniorId: string;
  skillId: string;
  skillName: string;
  proposedDate?: string;
  proposedTime?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  createdAt: string;
  completedAt?: string;
}

export interface MentorshipNote {
  id: string;
  mentorId: string;
  menteeId: string;
  skillId: string;
  skillName: string;
  note: string;
  rating?: number;
  createdAt: string;
}

export interface SearchAnalytics {
  id: string;
  query: string;
  resultsCount: number;
  clickedArticleId?: string;
  userId?: string;
  timestamp: string;
}

export interface KnowledgeGap {
  id: string;
  topic: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  suggestedBy: string;
  status: 'identified' | 'in-progress' | 'resolved' | "won't-fix";
  relatedArticleIds: string[];
  createdAt: string;
  resolvedAt?: string;
}

export interface KnowledgeSteward {
  userId: string;
  name: string;
  categories: ArticleCategory[];
  responsibilities: string[];
}
