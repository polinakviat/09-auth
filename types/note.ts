export interface Note {
  id: string; // ID має тип String
  title: string;
  content: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
  createdAt?: string;
  updatedAt?: string;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number; // Завжди 12
  search?: string;
  tag?: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tag: Note['tag'];
}

export interface NewNote {
  title: string;
  content: string;
  tag?: string;
}