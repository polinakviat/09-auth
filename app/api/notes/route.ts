import { api } from '../axios';
import type { Note, FetchNotesParams, CreateNoteDto } from '../../../types/note';

// GET /api/notes
export const fetchNotes = async (params: FetchNotesParams = {}): Promise<Note[]> => {
  const response = await api.get<Note[]>('/api/notes', {
    params: {
      page: params.page || 1,
      perPage: 12, // Обов'язково 12 за умовою
      search: params.search || undefined,
      tag: params.tag || undefined,
    },
  });
  return response.data;
};

// GET /api/notes/:id
export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/api/notes/${id}`);
  return response.data;
};

// POST /api/notes
export const createNote = async (dto: CreateNoteDto): Promise<Note> => {
  const response = await api.post<Note>('/api/notes', dto);
  return response.data;
};

// DELETE /api/notes/:id
export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/api/notes/${id}`);
  return response.data;
};