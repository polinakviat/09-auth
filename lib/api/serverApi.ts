import type { User } from '@/types/user';
import type { Note, NewNote } from '@/types/note';
import 'server-only';
import { cookies } from 'next/headers';
import { api } from './api';
import { AxiosResponse } from 'axios';

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

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const getMeServer = async (): Promise<User | null> => {
  try {
    const config = await getAuthHeaders();
    const response = await api.get<User>('/users/me', config);
    return response.data;
  } catch {
    return null;
  }
};

export const getMe = getMeServer;

export const fetchNotesServer = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse | Note[]> => {
  const config = await getAuthHeaders();
  const response = await api.get('/notes', {
    ...config,
    params: {
      page: params.page || 1,
      perPage: params.perPage || 12,
      search: params.search || undefined,
      tag: params.tag || undefined,
    },
  });
  return response.data;
};

export const fetchNotes = fetchNotesServer;

export const fetchNoteById = async (id: string): Promise<Note> => {
  const config = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, config);
  return response.data;
};

export const createNoteServer = async (noteData: NewNote): Promise<Note> => {
  const config = await getAuthHeaders();
  const response = await api.post<Note>('/notes', noteData, config);
  return response.data;
};
export const deleteNoteServer = async (noteId: string): Promise<void> => {
  const config = await getAuthHeaders();
  await api.delete(`/notes/${noteId}`, config);
};

export async function checkSession(): Promise<AxiosResponse<User>> {
  const config = await getAuthHeaders();
  const response = await api.get<User>('/auth/session', config);
  return response;
}