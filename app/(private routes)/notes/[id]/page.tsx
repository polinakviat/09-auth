import type { Metadata } from 'next';

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Note ${id} | Application`,
  };
}

export default async function NoteDetailsPage({ params }: NotePageProps) {
  const { id } = await params;

  return (
    <main>
      <h1>Note Details: {id}</h1>
    </main>
  );
}