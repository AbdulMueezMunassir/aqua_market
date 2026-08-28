'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ChatBubbleLeftIcon, 
  UserIcon 
} from '@heroicons/react/24/outline'

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Shop', href: '/shop', icon: HomeIcon },
  { name: 'Cart', href: '/cart', icon: ShoppingBagIcon },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
]

export function BottomNavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-xl border-t border-white/20 shadow-lg shadow-tertiary/10 rounded-t-lg md:hidden">
      <div className="flex justify-around items-center px-4 pb-safe h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-xl p-2 active:scale-90 transition-transform ${
                isActive
                  ? 'bg-primary-container/20 text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-primary-container/10'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-label-sm text-label-sm mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}