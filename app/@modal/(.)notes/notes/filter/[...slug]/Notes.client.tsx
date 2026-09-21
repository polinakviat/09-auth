'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import { fetchNotes  } from '../../../../../api/clientApi';
import type { Note } from '../../../../../../types/note';

import { NoteList } from '../../../../../../components/NoteList/NoteList';
import { SearchBox } from '../../../../../../components/SearchBox/SearchBox';
import { Pagination } from '../../../../../../components/Pagination/Pagination';

import css from './NotesPage.module.css';

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const { data, isLoading, isError, error } = useQuery({
      queryKey: ['notes', page, searchQuery, tag],
      queryFn: () => fetchNotes({ page, search: searchQuery, tag }),
      placeholderData: keepPreviousData,
    });
const notes: Note[] = data || [];
  const perPage = 12;
  const totalPages = notes.length < perPage && page === 1 ? 1 : notes.length === perPage ? page + 1 : page;

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        <Link href="/notes/action/create" className={css.createButton}>
          Create note +
        </Link>
      </div>

      {isLoading && <p className={css.statusText}>Завантаження нотаток...</p>}

      {isError && (
        <p className={css.errorText}>
          Помилка завантаження:{' '}
          {error instanceof Error ? error.message : 'Невідома помилка'}
        </p>
      )}

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} />}

      {!isLoading && !isError && notes.length === 0 && (
        <p className={css.statusText}>Нотаток не знайдено.</p>
      )}

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
