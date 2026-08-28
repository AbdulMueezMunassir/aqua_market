'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Categories', href: '/categories' },
  { name: 'New Arrivals', href: '/shop?filter=new' },
  { name: 'Popular', href: '/shop?filter=popular' },
]

export function TopNavBar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 dark:bg-inverse-surface/60 backdrop-blur-[40px] border-b border-white/20 dark:border-white/10 shadow-sm shadow-tertiary/5 hidden md:block transition-all duration-300">
      <div className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Aqua Market Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain rounded-xl"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrqGkhRvde7mnodoQLlJuwQ3dswok1EE7-KsDVGB3_0NUnusiCZezJiYf8NiqY_EjG_gH1sGsbnh3lr1EhnDMDxzuvNjFnvh00VoB23s3HScpAm2MVdNSzfvbG52GhjIm7C7eUa_fcTFx2nXwzVlgTXjN6PYmXDerq2jt1n77zPQzXE_9zg20fANEvxv8oLemhIJmza3fmsflaNbrt_95XO2vS2ApuaX-HrYSe1dTQ7xgsxpouEStI'
              }}
            />
            <span className="font-display-lg text-headline-md text-primary dark:text-primary-fixed-dim tracking-tight">
              Aqua Market
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`font-body-md text-body-md py-1 transition-colors duration-300 rounded px-2 ${
                pathname === item.href
                  ? 'text-primary dark:text-primary-fixed-dim border-b-2 border-primary font-bold'
                  : 'text-on-surface-variant dark:text-on-surface-variant/80 hover:text-primary hover:bg-white/10'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="relative bg-surface-container-low rounded-full px-4 py-2 flex items-center gap-2 border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-outline">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none focus:ring-0 text-body-md w-48 text-on-surface placeholder:text-outline/70 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
          
          <Link href="/cart" className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-error text-on-error text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>
          
          <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>
          
          <Link href="/profile">
            <Image
              src="/images/avatar.jpg"
              alt="Customer Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border-2 border-surface-container-high object-cover shadow-sm cursor-pointer active:scale-95"
              onError={(e) => {
                e.currentTarget.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaYd9GOncw9dZB12jXWdC2RuRpYXyBkyZgcUQ_J5QHjCY9oPGGt-PxpnLHWB13q1ltQ5k_whG1XpPavEQt8KujnIeDm0KdZbq4Ca-ZKDfjVyiTJ8Tgv3kwz1nPWfN6wrgyuHKlU-7JK-152Xt0HRyR2Imq3XZx-9XpTiFbJ-LbaNPxM4NZ5DTW4nAdzC2zuk-ZZ9xUesNF6F1SIsgR3jGyHCHKEnie8joFlFSOrD9fXBUDZmyaSJGr'
              }}
            />
          </Link>
        </div>
      </div>
    </header>
  )
}