import { cookies } from 'next/headers';
import { api } from './api';
import type { Note, FetchNotesParams } from '../../types/note';
import type { User } from '../../types/user';
import type { CheckSessionResponse } from './clientApi';

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const checkSession = async (): Promise<CheckSessionResponse> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await api.get<CheckSessionResponse>('/auth/session', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

// Допоміжна функція для отримання заголовків з кукі на сервері
const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async (params: FetchNotesParams = {}): Promise<Note[]> => {
  const authHeaders = await getAuthHeaders();
  const response = await api.get<Note[]>('/notes', {
    ...authHeaders,
    params: {
      page: params.page || 1,
      perPage: 12,
      search: params.search || undefined,
      tag: params.tag || undefined,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const authHeaders = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, authHeaders);
  return response.data;
};
