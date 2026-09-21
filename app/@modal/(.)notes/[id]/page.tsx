import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreviewClient from './NotePreview.client';

interface ModalNotePageProps {
  params: Promise<{ id: string }>;
}

export default async function InterceptedNoteModalPage({
  params,
}: ModalNotePageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  // Заздалегідь завантажуємо дані нотатки у кеш на сервері
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
