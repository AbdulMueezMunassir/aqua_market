'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Cart', href: '/cart' },
  { name: 'Messages', href: '/messages' },
  { name: 'Profile', href: '/profile' },
]

export function BottomNavBar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { getTotalItems } = useCartStore()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = mounted ? getTotalItems() : 0

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-xl border-t border-white/20 shadow-lg shadow-tertiary/10 rounded-t-lg md:hidden">
      <div className="flex justify-around items-center px-4 pb-safe h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-xl p-2 active:scale-90 transition-transform relative ${
                isActive
                  ? 'bg-primary-container/20 text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-primary-container/10'
              }`}
            >
              {item.name === 'Cart' && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-error text-on-error text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                {item.name === 'Home' && (
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                )}
                {item.name === 'Shop' && (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-6.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.75M2.36 21h13.14M2.36 21l-1.5-12.75h15L18 21M3 9.75h13.5M3 9.75l-1.5-6.75h18l-1.5 6.75" />
                )}
                {item.name === 'Cart' && (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                )}
                {item.name === 'Messages' && (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.25 20.25v-3.3A5.972 5.972 0 0 1 3 11.25c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                )}
                {item.name === 'Profile' && (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                )}
              </svg>
              <span className="font-label-sm text-[10px] mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}