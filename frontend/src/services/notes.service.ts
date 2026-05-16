import api from './api';
import { ApiResponse, Note, PaginatedNotes } from '../types';

interface NotesQuery {
  search?: string;
  tags?: string;
  archived?: boolean;
  pinned?: boolean;
  page?: number;
}

interface NoteInput {
  title?: string;
  content?: string;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
}

export const notesService = {
  async getNotes(query: NotesQuery = {}): Promise<PaginatedNotes> {
    const params: Record<string, string> = {};
    if (query.search) params.search = query.search;
    if (query.tags) params.tags = query.tags;
    if (query.archived !== undefined) params.archived = String(query.archived);
    if (query.pinned !== undefined) params.pinned = String(query.pinned);
    if (query.page) params.page = String(query.page);

    const res = await api.get<ApiResponse<PaginatedNotes>>('/notes', { params });
    return res.data.data;
  },

  async getNoteById(id: string): Promise<Note> {
    const res = await api.get<ApiResponse<Note>>(`/notes/${id}`);
    return res.data.data;
  },

  async createNote(data: NoteInput = {}): Promise<Note> {
    const res = await api.post<ApiResponse<Note>>('/notes', data);
    return res.data.data;
  },

  async updateNote(id: string, data: NoteInput): Promise<Note> {
    const res = await api.patch<ApiResponse<Note>>(`/notes/${id}`, data);
    return res.data.data;
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },

  async generateShareLink(id: string): Promise<string> {
    const res = await api.post<ApiResponse<{ shareId: string }>>(
      `/notes/${id}/share`
    );
    return res.data.data.shareId;
  },

  async removeShareLink(id: string): Promise<void> {
    await api.delete(`/notes/${id}/share`);
  },

  async getSharedNote(shareId: string): Promise<Note> {
    const res = await api.get<ApiResponse<Note>>(`/shared/${shareId}`);
    return res.data.data;
  },
};