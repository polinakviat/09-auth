import type { Metadata } from 'next';
import SignUpPage from './SignUpPage';

export const metadata: Metadata = {
  title: 'Sign Up | NoteHub',
  description: 'Create a new NoteHub account',
};

export default function Page() {
  return <SignUpPage />;
}