import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  const { token } = await req.json();

  const response = NextResponse.json({ message: 'Login successful' });

  // Kullanıcının kimlik doğrulama token'ını çerez olarak ayarla
  response.cookies.set('authToken', token, {
    path: '/',
    httpOnly: true,
    maxAge: 3600, // 1 saat geçerli
  });

  return response;
}
