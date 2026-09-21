import { api } from '../axios';
import type { User } from '../../../types/user';

// GET /api/users/me
export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>('/api/users/me');
  return response.data;
};

// PATCH /api/users/me
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('/api/users/me', userData);
  return response.data;
};