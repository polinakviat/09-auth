import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up']; // 👈 Змінено відповідно до вимог

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = !!accessToken;
  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const apiResponse = await checkSession();
      if (apiResponse) {
        isAuthenticated = true;

        // Переносимо нові куки (Set-Cookie) з відповіді бекенду до клієнта, якщо вони є
        const setCookieHeader = apiResponse.headers['set-cookie'];
        if (setCookieHeader) {
          // Якщо заголовки масивом або рядком, додаємо їх до вихідної відповіді
          if (Array.isArray(setCookieHeader)) {
            setCookieHeader.forEach((cookie) => {
              response.headers.append('Set-Cookie', cookie);
            });
          } else {
            response.headers.set('Set-Cookie', setCookieHeader);
          }
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Перенаправлення неавторизованих з приватних сторінок на /sign-in
  if (isPrivate && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in'; // 👈 Оновлений маршрут
    return NextResponse.redirect(url);
  }

  // Перенаправлення авторизованих з публічних сторінок на головну (/)
  if (isAuthRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};