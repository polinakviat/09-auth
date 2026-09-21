import type { Metadata } from 'next';
import { getMe } from '@/lib/api/serverApi';

export const metadata: Metadata = {
    title: 'Profile | Application',
}

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main>
      <h1>Profile</h1>
      <p>Username: {user?.username || '—'}</p>
    </main>
  );
}