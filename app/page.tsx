import Link from 'next/link';
import css from './page.module.css';

export const metadata = {
  title: 'NoteHub - Manage Your Notes Effortlessly',
  description: 'NoteHub is a simple and fast note-taking application.',
};

export default function HomePage() {
  return (
    <main className={css.main}>
      <section className={css.hero}>
        <header className={css.header}>
          <h1 className={css.title}>Welcome to NoteHub</h1>
          <p className={css.subtitle}>
            Manage, organize, and access your personal notes effortlessly and
            securely in one place.
          </p>
        </header>

        <div className={css.ctaContainer}>
          <Link href="/notes" className={css.ctaButton}>
            View Notes
          </Link>
        </div>
      </section>

      <section className={css.features}>
        <h2 className={css.featuresTitle}>Why NoteHub?</h2>
        <ul className={css.featuresList}>
          <li className={css.featureItem}>
            <strong>Fast Search:</strong> Quickly find notes by title or
            content.
          </li>
          <li className={css.featureItem}>
            <strong>Easy Management:</strong> Create, view, and delete notes
            easily.
          </li>
          <li className={css.featureItem}>
            <strong>Tags support:</strong> Categorize notes with custom tags.
          </li>
        </ul>
      </section>
    </main>
  );
}
