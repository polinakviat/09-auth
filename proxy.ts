import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers'; // 👈 Імпортуємо cookies з next/headers
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🛡️ Отримуємо куки через асинхронну функцію cookies() з next/headers
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

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
    url.pathname = '/sign-in';
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