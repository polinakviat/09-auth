'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './TagLink.module.css';

interface TagLinkProps {
  href: string;
  children: React.ReactNode;
}

export function TagLink({ href, children }: TagLinkProps) {
  const pathname = usePathname();

  // Логіка активного стану однакова для всіх тегів та для "All notes"
  const isActive =
    pathname === href ||
    (href === '/notes/filter/all' && pathname === '/notes/filter');

  return (
    <Link
      href={href}
      className={`${css.tagLink} ${isActive ? css.active : ''}`}
    >
      {children}
    </Link>
  );
}
