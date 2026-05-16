import api from './api';
import { ApiResponse, DashboardStats } from '../types';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const res = await api.get<ApiResponse<DashboardStats>>('/dashboard');
    return res.data.data;
  },
};