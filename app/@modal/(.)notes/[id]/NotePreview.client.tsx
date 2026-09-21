'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api/clientApi';
import { Modal } from '../../../../components/Modal/Modal';
import css from './NotePreview.module.css';
import Link from 'next/link';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

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

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div className={css.modalContent}>
        {isLoading && <p className={css.statusText}>Loading note details...</p>}

        {isError && (
          <div className={css.errorWrapper}>
            <p className={css.errorText}>
              {error instanceof Error
                ? error.message
                : 'Failed to load note details.'}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className={css.closeBtn}
            >
              Close
            </button>
          </div>
        )}

        {note && (
          <article className={css.container}>
            <header className={css.header}>
              <h2 className={css.title}>{note.title}</h2>
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
        )}
      </div>
    </Modal>
  );
}
