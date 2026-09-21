import type { Metadata } from 'next';
import SignInPage from './SignInPage';

export const metadata: Metadata = {
  title: 'Sign In | NoteHub',
  description: 'Sign in to your NoteHub account',
};

export default function Page() {
  return <SignInPage />;
}