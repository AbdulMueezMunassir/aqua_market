import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value
  const path = request.nextUrl.pathname
  
  console.log('🔍 Middleware:', path, 'Token:', token ? '✅' : '❌')

  // ALWAYS allow API routes
  if (path.startsWith('/api')) {
    return NextResponse.next()
  }

  // ALWAYS allow static files
  if (path.includes('.')) {
    return NextResponse.next()
  }

  // ALWAYS allow auth pages
  if (path === '/auth/login' || path === '/auth/register') {
    return NextResponse.next()
  }

  // ALWAYS allow public pages
  const publicPaths = ['/', '/shop', '/categories', '/popular', '/wishlist', '/cart']
  if (publicPaths.includes(path) || path.startsWith('/product/')) {
    return NextResponse.next()
  }

  // ⭐ KEY FIX: If user has token, allow profile
  if (token && path === '/profile') {
    return NextResponse.next()
  }

  // ⭐ KEY FIX: If user has token, allow orders
  if (token && path === '/orders') {
    return NextResponse.next()
  }

  // ⭐ KEY FIX: If user has token, allow checkout
  if (token && path === '/checkout') {
    return NextResponse.next()
  }

  // ⭐ KEY FIX: If user has token, allow admin
  if (token && path.startsWith('/admin')) {
    return NextResponse.next()
  }

  // If NO token and trying to access protected routes, redirect to login
  const protectedPaths = ['/admin', '/profile', '/orders', '/checkout']
  if (!token && protectedPaths.some(p => path.startsWith(p))) {
    console.log('🔒 Redirecting to login from:', path)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}