import type { Metadata } from 'next';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '../../../../lib/api/notes/notes';
import NotesPageClient from './NotesPage.client';

interface FilterPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({
  params,
}: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawTag = slug?.[0];
  const tagTitle =
    rawTag && rawTag !== 'all' ? decodeURIComponent(rawTag) : 'All';

  const title = `${tagTitle} Notes | NoteHub`;
  const description = `Browse and filter notes by category: ${tagTitle}.`;
  const url = `https://notehub.com/notes/filter/${rawTag || 'all'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes filtered by ${tagTitle}`,
        },
      ],
    },
  };
}

export default async function NotesFilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const rawTag = slug?.[0];
  const tag =
    rawTag && rawTag !== 'all' ? decodeURIComponent(rawTag) : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '', tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesPageClient tag={tag} />
    </HydrationBoundary>
  );
}
