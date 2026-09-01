import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const path = request.nextUrl.pathname
  
  // Public paths
  const publicPaths = ['/auth/login', '/auth/register']
  const isPublicPath = publicPaths.includes(path)
  
  // Protected paths
  const protectedPaths = ['/admin', '/staff', '/profile', '/orders', '/checkout']
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p))
  
  // API routes - allow all
  if (path.startsWith('/api')) {
    return NextResponse.next()
  }
  
  // If user is authenticated and tries to access login/register, redirect to home
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // If user is not authenticated and tries to access protected route, redirect to login
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}