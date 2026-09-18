'use client'

import { usePathname } from 'next/navigation'
import { TopNavBar } from '@/components/common/TopNavBar'
import { BottomNavBar } from '@/components/common/BottomNavBar'
import { Footer } from '@/components/common/Footer'

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Hide customer UI on admin pages
  const isAdminRoute = pathname?.startsWith('/admin')

  // Auth pages: no top/bottom nav, but keep them minimal
  const isAuthRoute =
    pathname?.startsWith('/auth/login') || pathname?.startsWith('/auth/register')

  if (isAdminRoute) {
    // Admin pages: just render children (admin sidebar comes from each page)
    return <>{children}</>
  }

  if (isAuthRoute) {
    // Auth pages: full-screen, no chrome
    return <>{children}</>
  }

  // Regular customer pages: full shell with header, footer, bottom nav
  return (
    <>
      <TopNavBar />
      <main className="min-h-screen pt-24 pb-16 md:pb-0">{children}</main>
      <Footer />
      <BottomNavBar />
    </>
  )
}