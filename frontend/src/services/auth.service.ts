import api from './api';
import { ApiResponse, AuthResponse, User } from '../types';

export const authService = {
  async signup(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/signup', data);
    return res.data.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },
};