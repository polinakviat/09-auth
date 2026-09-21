import type { Metadata } from 'next';

interface FilterSlugPageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: FilterSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slug?.join('/') || 'All';
  return {
    title: `Filtered Notes: ${category} | Application`,
  };
}

export default async function FilterSlugPage({ params }: FilterSlugPageProps) {
  const { slug } = await params;

  return (
    <main>
      <h1>Filtered Notes</h1>
      <p>Active Filters: {slug ? slug.join(' / ') : 'None'}</p>
    </main>
  );
}