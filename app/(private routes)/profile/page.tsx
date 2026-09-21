import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import { getMe } from '@/lib/api/serverApi'; // Перевірте шлях до вашого серверного API
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'User Profile',
};

export default async function ProfilePage() {
  const user = await getMe();

  // 🛡️ Захист від null/undefined: якщо користувача немає, виводимо повідомлення або редіректимо
  if (!user) {
    return (
      <div className={css.container}>
        <p className={css.errorText}>Не вдалося завантажити дані користувача.</p>
      </div>
    );
  }

  return (
    <main className={css.container}>
      <div className={css.profileCard}>
        {/* Використовуємо компонент Image замість <img> */}
        <Image
          src={user.avatar || '/default-avatar.png'} // Запасний варіант, якщо аватар відсутній
          alt="User Avatar"
          width={100}
          height={100}
          className={css.avatar}
          priority
        />

        <div className={css.info}>
          <h1 className={css.username}>{user.username}</h1>
          <p className={css.email}>{user.email}</p>
        </div>

        <Link href="/profile/edit" className={css.editButton}>
          Edit Profile
        </Link>
      </div>
    </main>
  );
}