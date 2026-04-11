import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  KnowledgeArticle,
  InsightPost,
  IssueTicket,
  OffboardingRecord,
  LearningPathway,
  Notification,
  Comment,
  UserRole,
  QMSFeedback,
  ShadowRequest,
  MentorshipNote,
} from '@/types';
import {
  mockUsers,
  mockArticles,
  mockInsightPosts,
  mockIssueTickets,
  mockOffboardingRecords,
  mockLearningPathways,
  mockNotifications,
  mockQMSFeedback,
} from './data';

interface AppState {
  currentUser: User | null;
  users: User[];
  articles: KnowledgeArticle[];
  insightPosts: InsightPost[];
  issueTickets: IssueTicket[];
  offboardingRecords: OffboardingRecord[];
  learningPathways: LearningPathway[];
  notifications: Notification[];
  qmsFeedback: QMSFeedback[];
  shadowRequests: ShadowRequest[];
  mentorshipNotes: MentorshipNote[];

  setCurrentUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  
  addArticle: (article: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => void;
  updateArticle: (id: string, updates: Partial<KnowledgeArticle>) => void;
  deleteArticle: (id: string) => void;
  flagArticle: (id: string, userId: string) => void;
  clearFlagArticle: (id: string) => void;
  
  addInsightPost: (post: Omit<InsightPost, 'id' | 'createdAt' | 'upvotes' | 'hasUpvoted' | 'comments' | 'isVerifiedSolution'>) => void;
  toggleUpvote: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  verifySolution: (postId: string) => void;
  verifyComment: (postId: string, commentId: string) => void;
  
  addIssueTicket: (ticket: Omit<IssueTicket, 'id' | 'createdAt' | 'updatedAt' | 'postMortemGenerated'>) => void;
  updateTicketStatus: (id: string, status: IssueTicket['status'], resolutionNotes?: string, rootCause?: string, preventativeMeasures?: string) => void;
  
  addOffboardingRecord: (record: Omit<OffboardingRecord, 'id' | 'createdAt'>) => void;
  updateOffboardingStatus: (id: string, status: OffboardingRecord['knowledgeTransferStatus']) => void;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  enrollInPathway: (pathwayId: string) => void;
  completeModule: (pathwayId: string, moduleId: string) => void;
  
  addQMSFeedback: (feedback: Omit<QMSFeedback, 'id' | 'createdAt'>) => void;
  
  createShadowRequest: (request: Omit<ShadowRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateShadowRequestStatus: (id: string, status: ShadowRequest['status']) => void;
  
  addMentorshipNote: (note: Omit<MentorshipNote, 'id' | 'createdAt'>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: mockUsers[0],
      users: mockUsers,
      articles: mockArticles,
      insightPosts: mockInsightPosts,
      issueTickets: mockIssueTickets,
      offboardingRecords: mockOffboardingRecords,
      learningPathways: mockLearningPathways,
      notifications: mockNotifications,
      qmsFeedback: mockQMSFeedback,
      shadowRequests: [
        {
          id: 'sr-1',
          juniorId: '1',
          seniorId: '2',
          skillId: 'sup-1',
          skillName: 'E-Tax API Integration',
          proposedDate: '2025-04-25',
          proposedTime: '14:00',
          message: 'Would like to pair program on the e-Tax portal integration. I\'ve read the docs but need hands-on guidance.',
          status: 'pending',
          createdAt: '2025-04-20T10:00:00Z',
        },
      ],
      mentorshipNotes: [
        {
          id: 'mn-1',
          mentorId: '2',
          menteeId: '1',
          skillId: 'dept-1',
          skillName: 'Ministry API Integration',
          note: 'Bethel showed excellent initiative in researching the Kebele ID API. She understood the authentication flow quickly and was able to implement a basic integration within the session. Recommend she practice with the staging environment before touching production.',
          rating: 5,
          createdAt: '2025-04-15T16:00:00Z',
        },
      ],

      setCurrentUser: (user) => set({ currentUser: user }),

      switchRole: (role) => {
        const user = mockUsers.find((u) => u.role === role);
        if (user) set({ currentUser: user });
      },

      addArticle: (article) => {
        const newArticle: KnowledgeArticle = {
          ...article,
          id: `article-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          likes: 0,
        };
        set((state) => ({
          articles: [newArticle, ...state.articles],
        }));
      },

      updateArticle: (id, updates) => {
        set((state) => ({
          articles: state.articles.map((article) =>
            article.id === id
              ? { ...article, ...updates, updatedAt: new Date().toISOString() }
              : article
          ),
        }));
      },

      deleteArticle: (id) => {
        set((state) => ({
          articles: state.articles.filter((article) => article.id !== id),
        }));
      },

      flagArticle: (id, userId) => {
        set((state) => ({
          articles: state.articles.map((article) =>
            article.id === id
              ? { ...article, needsVerification: true, flaggedBy: userId, flaggedAt: new Date().toISOString() }
              : article
          ),
        }));
      },

      clearFlagArticle: (id) => {
        set((state) => ({
          articles: state.articles.map((article) =>
            article.id === id
              ? { ...article, needsVerification: false, flaggedBy: undefined, flaggedAt: undefined }
              : article
          ),
        }));
      },

      addInsightPost: (post) => {
        const newPost: InsightPost = {
          ...post,
          id: `post-${Date.now()}`,
          createdAt: new Date().toISOString(),
          upvotes: 0,
          hasUpvoted: false,
          comments: [],
          isVerifiedSolution: false,
        };
        set((state) => ({
          insightPosts: [newPost, ...state.insightPosts],
        }));
      },

      toggleUpvote: (postId) => {
        set((state) => ({
          insightPosts: state.insightPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  hasUpvoted: !post.hasUpvoted,
                  upvotes: post.hasUpvoted ? post.upvotes - 1 : post.upvotes + 1,
                }
              : post
          ),
        }));
      },

      addComment: (postId, content) => {
        const { currentUser } = get();
        if (!currentUser) return;

        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          authorId: currentUser.id,
          content,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          insightPosts: state.insightPosts.map((post) =>
            post.id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          ),
        }));
      },

      verifySolution: (postId) => {
        set((state) => ({
          insightPosts: state.insightPosts.map((post) =>
            post.id === postId
              ? { ...post, isVerifiedSolution: true }
              : post
          ),
        }));
      },

      verifyComment: (postId, commentId) => {
        set((state) => ({
          insightPosts: state.insightPosts.map((post) => {
            if (post.id !== postId) return post;
            return {
              ...post,
              verifiedCommentId: commentId,
              comments: post.comments.map((c) => ({
                ...c,
                isVerified: c.id === commentId,
              })),
            };
          }),
        }));
      },

      addIssueTicket: (ticket) => {
        const newTicket: IssueTicket = {
          ...ticket,
          id: `ticket-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          postMortemGenerated: false,
        };
        set((state) => ({
          issueTickets: [newTicket, ...state.issueTickets],
        }));
      },

      updateTicketStatus: (id, status, resolutionNotes, rootCause, preventativeMeasures) => {
        set((state) => ({
          issueTickets: state.issueTickets.map((ticket) =>
            ticket.id === id
              ? {
                  ...ticket,
                  status,
                  resolutionNotes: resolutionNotes || ticket.resolutionNotes,
                  rootCause: rootCause || ticket.rootCause,
                  preventativeMeasures: preventativeMeasures || ticket.preventativeMeasures,
                  postMortemGenerated: status === 'Resolved',
                  updatedAt: new Date().toISOString(),
                }
              : ticket
          ),
        }));
      },

      addOffboardingRecord: (record) => {
        const newRecord: OffboardingRecord = {
          ...record,
          id: `offboard-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          offboardingRecords: [newRecord, ...state.offboardingRecords],
        }));
      },

      updateOffboardingStatus: (id, status) => {
        set((state) => ({
          offboardingRecords: state.offboardingRecords.map((record) =>
            record.id === id ? { ...record, knowledgeTransferStatus: status } : record
          ),
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
        }));
      },

      enrollInPathway: (pathwayId) => {
        set((state) => ({
          learningPathways: state.learningPathways.map((pathway) =>
            pathway.id === pathwayId
              ? { ...pathway, progress: 'in-progress' as const, enrolledAt: new Date().toISOString() }
              : pathway
          ),
        }));
      },

      completeModule: (pathwayId, moduleId) => {
        set((state) => ({
          learningPathways: state.learningPathways.map((pathway) => {
            if (pathway.id !== pathwayId) return pathway;
            const allCompleted = pathway.modules.every(
              (m) => m.id === moduleId || m.order < 1
            );
            return {
              ...pathway,
              progress: allCompleted ? 'completed' as const : 'in-progress' as const,
              completedAt: allCompleted ? new Date().toISOString() : undefined,
            };
          }),
        }));
      },

      addQMSFeedback: (feedback) => {
        const newFeedback: QMSFeedback = {
          ...feedback,
          id: `qms-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          qmsFeedback: [newFeedback, ...state.qmsFeedback],
        }));
      },

      createShadowRequest: (request) => {
        const newRequest: ShadowRequest = {
          ...request,
          id: `shadow-${Date.now()}`,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          shadowRequests: [newRequest, ...state.shadowRequests],
        }));
      },

      updateShadowRequestStatus: (id, status) => {
        set((state) => ({
          shadowRequests: state.shadowRequests.map((req) =>
            req.id === id
              ? { ...req, status, completedAt: status === 'completed' ? new Date().toISOString() : undefined }
              : req
          ),
        }));
      },

      addMentorshipNote: (note) => {
        const newNote: MentorshipNote = {
          ...note,
          id: `mentorship-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          mentorshipNotes: [newNote, ...state.mentorshipNotes],
        }));
      },
    }),
    {
      name: 'a-mesob-kms-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);
