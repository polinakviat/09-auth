import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await fetchNoteById(id);
    return {
      title: note.title || 'Note Details',
    };
  } catch {
    return {
      title: 'Note Details',
    };
  }
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // Виключно prefetchQuery, жодних присвоювань у змінні чи fetchQuery
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}