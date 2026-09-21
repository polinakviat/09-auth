import { api } from './api';
import type { User } from '@/types/user';
import type { Note, NewNote } from '@/types/note';

export const fetchNotes = async (params: FetchNotesParams = {}) => {
  const response = await api.get('/notes', { params });
  return response.data;
};

export interface AuthCredentials {
  email: string;
  password: string;
}

export type LoginRequest = AuthCredentials;
export type RegisterRequest = AuthCredentials;

export interface CheckSessionResponse {
  success: boolean;
  user?: User;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface UpdateUserRequest {
  username?: string;
  avatar?: string;
}

export const login = async (credentials: LoginRequest): Promise<User> => {
  const response = await api.post<User>('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterRequest): Promise<User> => {
  const response = await api.post<User>('/auth/register', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSessionClient = async (): Promise<CheckSessionResponse> => {
  const response = await api.get<CheckSessionResponse>('/auth/session');
  return response.data;
};

export const checkSession = checkSessionClient;

export const getMeClient = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};
export const getMe = getMeClient;

export const updateMe = async (data: UpdateUserRequest): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData: NewNote): Promise<Note> => {
  const response = await api.post<Note>('/notes', noteData);
  return response.data;
};


export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
}