import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

// Масиви приватних та публічних маршрутів
const privateRoutes = ['/profile', '/dashboard', '/settings'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let isAuthenticated = false;

  try {
    const session = await checkSession();
    isAuthenticated = Boolean(session?.success);
  } catch (error) {
    isAuthenticated = false;
  }

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // 1. Неавторизований користувач намагається відкрити приватний маршрут -> редірект на /sign-in
  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // 2. Авторизований користувач намагається відкрити публічний маршрут (sign-in/sign-up) -> редірект на /profile
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Запускати proxy для всіх маршрутів, окрім:
     * - api маршрутів (/api/...)
     * - статичних файлів (_next/static, _next/image, favicon.ico тощо)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};