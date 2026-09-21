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
