import api from './api';
import { ApiResponse, AISummary } from '../types';

export const aiService = {
  async generateSummary(noteId: string): Promise<AISummary> {
    const res = await api.post<ApiResponse<AISummary>>(
      `/notes/${noteId}/generate-summary`
    );
    return res.data.data;
  },
};