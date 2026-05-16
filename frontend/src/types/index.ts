// Centralize all types — import from here everywhere

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AISummary {
  summary: string;
  actionItems: string[];
  suggestedTitle: string;
  generatedAt: string;
}

export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  isPublic: boolean;
  shareId?: string;
  aiSummary?: AISummary;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNotes {
  notes: Note[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  overview: {
    totalNotes: number;
    archivedNotes: number;
    pinnedNotes: number;
    notesWithAI: number;
  };
  recentNotes: Partial<Note>[];
  topTags: { tag: string; count: number }[];
  aiUsage: {
    totalSummaries: number;
    totalTokensUsed: number;
  };
  weeklyActivity: { date: string; count: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}