'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/categories' },
  { name: 'New Arrivals', href: '/shop?sort=-createdAt' },
  { name: 'Popular', href: '/popular' },
]

export function TopNavBar() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const { getTotalItems } = useCartStore()
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = mounted ? getTotalItems() : 0

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 dark:bg-inverse-surface/60 backdrop-blur-[40px] border-b border-white/20 dark:border-white/10 shadow-sm shadow-tertiary/5 hidden md:block transition-all duration-300">
      <div className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <span className="font-display-lg text-headline-md text-primary dark:text-primary-fixed-dim tracking-tight">
              Aqua Market
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '/shop' && pathname?.startsWith('/shop'))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`font-body-md text-body-md py-1 transition-colors duration-300 rounded px-2 ${
                  isActive
                    ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary font-bold'
                    : 'text-on-surface-variant dark:text-on-surface-variant/80 hover:text-primary hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative bg-surface-container-low rounded-full px-4 py-2 flex items-center gap-2 border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-outline">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search fish..."
              className="bg-transparent border-none focus:ring-0 text-body-md w-48 text-on-surface placeholder:text-outline/70 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          {/* Wishlist Link */}
          <Link 
            href="/wishlist" 
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </Link>
          
          {/* Cart Link */}
          <Link href="/cart" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-on-error text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-surface-container-high shadow-sm cursor-pointer active:scale-95 hover:shadow-md transition-all">
                  <span className="text-primary font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </Link>
              <button
                onClick={logout}
                className="text-sm text-on-surface-variant hover:text-error transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm text-primary hover:underline transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="text-sm btn-primary px-4 py-2"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}