'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes } from '../../../../../api/clientApi';
import type { Note } from '../../../../../../types/note';

import { NoteList } from '../../../../../../components/NoteList/NoteList';
import { SearchBox } from '../../../../../../components/SearchBox/SearchBox';
import { Pagination } from '../../../../../../components/Pagination/Pagination';

import css from './NotesPage.module.css';

interface NotesClientProps {
  tag?: string;
}

export default function NotesPageClient({ tag }: NotesClientProps) {
  // 1. Стани залишено лише для пагінації та пошуку
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

  const perPage = 12;

  // 2. Debounce для пошуку
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

const { data, isLoading, isError, error } = useQuery({
  queryKey: ['notes', page, searchQuery, tag],
  queryFn: () => fetchNotes({ page, perPage, search: searchQuery, tag }),
  placeholderData: keepPreviousData,
});

const notes: Note[] = data || [];
const totalPages: number = notes.length < perPage && page === 1 ? 1 : notes.length === perPage ? page + 1 : page;

  return (
    <div className={css.container}>
      {/* Тулбар: SearchBox та посилання-кнопка на створеня нотатки */}
      <div className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.createButton}>
          Create note +
        </Link>
      </div>

      {/* Відображення станів завантаження та помилки */}
      {isLoading && <p className={css.statusText}>Завантаження нотаток...</p>}

      {isError && (
        <p className={css.errorText}>
          Помилка завантаження:{' '}
          {error instanceof Error ? error.message : 'Невідома помилка'}
        </p>
      )}

      {/* Список нотаток */}
      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {/* Повідомлення, якщо нотаток немає */}
      {!isLoading && !isError && notes.length === 0 && (
        <p className={css.statusText}>Нотаток не знайдено.</p>
      )}

      {/* Пагінація */}
      {!isLoading && !isError && totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={(newPage: number) => setPage(newPage)}
        />
      )}
    </div>
  );
}
