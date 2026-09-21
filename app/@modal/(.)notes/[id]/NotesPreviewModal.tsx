'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api/api';
import { Modal } from '../../../../components/Modal/Modal';
import css from './NotePreviewModal.module.css';

interface NotePreviewModalProps {
  id: string;
}

export default function NotePreviewModal({ id }: NotePreviewModalProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
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
      <div className={css.container}>
        {isLoading && <p className={css.status}>Loading note details...</p>}

        {isError && <p className={css.error}>Failed to load note preview.</p>}

        {note && (
          <article className={css.content}>
            <header className={css.header}>
              <h2 className={css.title}>{note.title}</h2>
              {note.tag && <span className={css.tag}>{note.tag}</span>}
            </header>

            <p className={css.text}>{note.content}</p>

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
