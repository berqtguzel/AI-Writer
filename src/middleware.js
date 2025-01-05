import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('authToken');
  const url = req.nextUrl.clone();

  // Eğer authToken yoksa login sayfasına yönlendir
  if (!token) {
    if (url.pathname !== '/login') {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  } else {
    // Eğer authToken varsa login sayfasına erişimi engelle
    if (url.pathname === '/login') {
      url.pathname = '/main';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Sadece belirli rotalarda çalışacak
export const config = {
  matcher: ['/', '/main', '/login'], // Gerekli rotaları buraya ekleyin
};