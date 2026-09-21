import { api } from '../axios';
import type { User } from '../../../types/user';
import {AuthCredentials } from '../../../lib/auth'

export const loginUser = async (credentials: AuthCredentials): Promise<User> => {
  const response = await api.post<User>('/api/auth/login', credentials);
  return response.data;
};

export const registerUser = async (credentials: AuthCredentials): Promise<User> => {
  const response = await api.post<User>('/api/auth/register', credentials);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post('/api/auth/logout');
};

export const getSession = async (): Promise<User | null> => {
  const response = await api.get<User | null>('/api/auth/session');
  return response.data;
};