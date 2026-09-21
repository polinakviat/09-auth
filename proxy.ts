import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/login', '/register'];

// 👈 Змініть назву функції на 'proxy' або експортуйте її як proxy
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = !!accessToken;
  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const session = await checkSession();
      if (session) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isPrivate && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/login', '/register'],
};