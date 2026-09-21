import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreviewClient from './NotePreview.client';

interface ModalNotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ModalNotePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await fetchNoteById(id);
    return {
      title: note.title || 'Note Preview',
    };
  } catch {
    return {
      title: 'Note Preview',
    };
  }
}

export default async function ModalNotePage({ params }: ModalNotePageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={id} />
    </HydrationBoundary>
  );
}
