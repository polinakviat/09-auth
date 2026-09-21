import { Metadata } from 'next';
import { fetchNotes } from '@/lib/api/serverApi';
import type { Note } from '@/types/note';

interface FilterPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] ? decodeURIComponent(slug[0]) : 'All';
  
  return {
    title: `Notes filtered by ${tag}`,
  };
}

export default async function FilteredNotesPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] ? decodeURIComponent(slug[0]) : undefined;

  // Отримуємо дані з серверного API
  const response = await fetchNotes({ tag });
  
  // Витягуємо сам масив нотаток із відповіді (залежно від структури API це може бути response.notes або response.data)
  // Якщо fetchNotes повертає безпосередньо масив, просто залиште response
  const notes: Note[] = Array.isArray(response) ? response : response.notes || [];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Notes for tag: <span className="text-blue-600">{tag}</span>
      </h1>
      
      <ul className="space-y-4">
        {notes.map((note: Note) => (
          <li key={note.id} className="p-4 border rounded shadow-sm">
            <h2 className="font-semibold">{note.title}</h2>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}