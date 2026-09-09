import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Get token from cookies or authorization header
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  console.log(`🔍 Middleware: ${path} Token: ${token ? '✅' : '❌'}`)
  
  // Define public paths (no authentication required)
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/api/auth/login',
    '/api/auth/register',
    '/shop',
    '/products',
    '/api/products',
    '/categories',
    '/popular',
    '/product',
    '/api/payment',
    '/api/admin/analytics',
    '/api/admin/orders',
  ]
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(p => path.startsWith(p)) || 
                       path === '/' ||
                       path.startsWith('/_next') ||
                       path.startsWith('/favicon.ico') ||
                       path.startsWith('/images') ||
                       path.startsWith('/api/products') ||
                       path === '/api/auth/me'
  
  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    console.log(`🔒 Redirecting to login from: ${path}`)
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }
  
  // If token exists, allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|api/webhook|api/stripe/webhook).*)',
  ],
}