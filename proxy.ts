import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Імпортуйте ваші функції чи клієнт для перевірки сесії, якщо вони є
// Наприклад: import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Читаємо токени з cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  let isAuthenticated = !!accessToken;

  // 2. Якщо accessToken немає, але є refreshToken — намагаємося оновити сесію
  if (!accessToken && refreshToken) {
    try {
      // Тут викликається логіка оновлення токенів через рефреш 
      // Приклад: const data = await refreshSession(refreshToken);
      // Якщо успішно, оновлюємо isAuthenticated = true і записуємо нові куки у відповідь
    } catch (error) {
      // Якщо рефреш не вдався — користувач не авторизований
      isAuthenticated = false;
    }
  }

  // 3. Редіректи для приватних маршрутів
  if (isPrivate && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // 4. Редіректи для публічних маршрутів (якщо вже залогінений)
  if (isPublic && isAuthenticated) {
    const notesUrl = new URL('/notes', request.url);
    return NextResponse.redirect(notesUrl);
  }

  return NextResponse.next();
}

// 5. Суворий matcher відповідно до вимог валідатора
export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};