import { api } from './api';
import type { User } from '../../types/user';

export interface UpdateUserRequest {
  username?: string;
  avatar?: string;
}

export const updateMe = async (data: UpdateUserRequest): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
};

export interface RegisterRequest {
  email: string;
  password: string;
}

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};

export interface CheckSessionResponse {
  success: boolean;
}

export const checkSession = async (): Promise<CheckSessionResponse> => {
  const response = await api.get<CheckSessionResponse>('/auth/session');
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};