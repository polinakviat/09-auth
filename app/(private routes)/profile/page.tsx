import type { Metadata } from 'next';
import Link from 'next/link';
import { getMe } from '@/app/api/serverApi';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Profile | Application',
  description: 'User profile page with account details.',
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <img
      src={user?.avatar || '/default-avatar.png'}
      alt={user?.username || 'User Avatar'}
      width={120}
      height={120}
      className={css.avatar}
    />
        </div>
        <div className={css.profileInfo}>
    <p>Username: {user?.username || '—'}</p>
    <p>Email: {user?.email || '—'}</p>
  </div>
      </div>
    </main>
  );
}

