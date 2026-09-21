'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '../../../lib/store/authStore';
import css from './page.module.css';

interface ApiErrorResponse {
  message?: string;
}

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Тут має бути login, а не register
      const userData = await login({ email, password });
      setUser(userData);
      router.push('/profile');
    } catch (err: unknown) {
      const errorObj = err as AxiosError<ApiErrorResponse>;
      const errorMessage =
        errorObj.response?.data?.message ||
        errorObj.message ||
        'Something went wrong. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}