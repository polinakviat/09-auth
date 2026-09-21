import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Перевірка наявності кукі сесії (назва кукі залежить від реалізації вашого API, зазвичай sessionId або token)
  const sessionToken = request.cookies.get('sessionId')?.value || request.cookies.get('token')?.value;

  const isPrivateKeyRoute = pathname.startsWith('/notes') || pathname.startsWith('/profile');
  const isAuthRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  // 1. Неавторизованого користувача перенаправляємо на /sign-in при спробі відкрити приватний маршрут
  if (isPrivateKeyRoute && !sessionToken) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // 2. Вже авторизованого користувача перенаправляємо з авторизаційних сторінок на /notes/filter/all
  if (isAuthRoute && sessionToken) {
    const notesUrl = new URL('/notes/filter/all', request.url);
    return NextResponse.redirect(notesUrl);
  }

  return NextResponse.next();
}

// Конфігурація для спрацьовування лише на потрібних маршрутах
export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};