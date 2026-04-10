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
} from '@/types';
import {
  mockUsers,
  mockArticles,
  mockInsightPosts,
  mockIssueTickets,
  mockOffboardingRecords,
  mockLearningPathways,
  mockNotifications,
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

  setCurrentUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  
  addArticle: (article: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => void;
  updateArticle: (id: string, updates: Partial<KnowledgeArticle>) => void;
  deleteArticle: (id: string) => void;
  
  addInsightPost: (post: Omit<InsightPost, 'id' | 'createdAt' | 'upvotes' | 'hasUpvoted' | 'comments'>) => void;
  toggleUpvote: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  
  addIssueTicket: (ticket: Omit<IssueTicket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicketStatus: (id: string, status: IssueTicket['status'], resolutionNotes?: string) => void;
  
  addOffboardingRecord: (record: Omit<OffboardingRecord, 'id' | 'createdAt'>) => void;
  updateOffboardingStatus: (id: string, status: OffboardingRecord['knowledgeTransferStatus']) => void;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  enrollInPathway: (pathwayId: string) => void;
  completeModule: (pathwayId: string, moduleId: string) => void;
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

      addInsightPost: (post) => {
        const newPost: InsightPost = {
          ...post,
          id: `post-${Date.now()}`,
          createdAt: new Date().toISOString(),
          upvotes: 0,
          hasUpvoted: false,
          comments: [],
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

      addIssueTicket: (ticket) => {
        const newTicket: IssueTicket = {
          ...ticket,
          id: `ticket-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          issueTickets: [newTicket, ...state.issueTickets],
        }));
      },

      updateTicketStatus: (id, status, resolutionNotes) => {
        set((state) => ({
          issueTickets: state.issueTickets.map((ticket) =>
            ticket.id === id
              ? {
                  ...ticket,
                  status,
                  resolutionNotes: resolutionNotes || ticket.resolutionNotes,
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
    }),
    {
      name: 'a-mesob-kms-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);
