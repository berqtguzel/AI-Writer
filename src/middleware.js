import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('authToken');
  const url = req.nextUrl.clone();

  // Eğer authToken yoksa /main sayfasına erişimi engelle
  if (!token && url.pathname === '/main') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Sadece belirli rotalarda çalışacak
export const config = {
  matcher: ['/main'], // Sadece /main rotasını kontrol eder
};