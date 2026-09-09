import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for token in cookies or headers
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  const path = request.nextUrl.pathname
  
  // Public paths (no auth required)
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/shop',
    '/product',
    '/categories',
    '/popular',
    '/wishlist',
    '/cart',
    '/about',
    '/contact',
    '/faq',
  ]
  
  // Check if current path is public
  const isPublicPath = publicPaths.some(p => path === p || path.startsWith('/product/') || path.startsWith('/mock-payment/'))
  
  // Protected paths (auth required)
  const protectedPaths = [
    '/admin',
    '/staff', 
    '/profile',
    '/orders',
    '/checkout',
    '/order-success',
  ]
  
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p))
  
  // API routes - always allow
  if (path.startsWith('/api')) {
    return NextResponse.next()
  }
  
  // Static files - always allow
  if (path.includes('.')) {
    return NextResponse.next()
  }
  
  // If NOT authenticated and trying to access protected route, redirect to login
  if (!token && isProtectedPath) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }
  
  // Allow all other requests (including login page)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}