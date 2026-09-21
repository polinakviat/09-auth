'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { fetchNoteById } from '../../../lib/api/api';
import css from './NoteDetails.module.css';

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p className={css.statusText}>Loading note details...</p>;
  }

  if (isError || !note) {
    return (
      <div className={css.container}>
        <p className={css.errorText}>
          {error instanceof Error ? error.message : 'Failed to load note.'}
        </p>
        <Link href="/notes" className={css.backLink}>
          ← Back to Notes
        </Link>
      </div>
    );
  }

  return (
    <article className={css.container}>
      <header className={css.header}>
        <Link href="/notes" className={css.backLink}>
          ← Back to Notes
        </Link>
        <h1 className={css.title}>{note.title}</h1>
        {note.tag && <span className={css.tag}>{note.tag}</span>}
      </header>

      <section className={css.content}>
        <p className={css.text}>{note.content}</p>
      </section>

      {note.createdAt && (
        <footer className={css.footer}>
          <time dateTime={note.createdAt}>
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </time>
        </footer>
      )}
    </article>
  );
}
