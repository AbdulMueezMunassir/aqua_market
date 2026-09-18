'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChartBarIcon,
  TagIcon,
  HeartIcon,
  ShoppingBagIcon,
  UsersIcon,
  EnvelopeIcon,
  BellIcon,
  StarIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import { ChartBarIcon as ChartBarSolid } from '@heroicons/react/24/solid'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: ChartBarIcon, solidIcon: ChartBarSolid },
  { name: 'Categories', href: '/admin/categories', icon: TagIcon },
  { name: 'Fish', href: '/admin/fish', icon: HeartIcon },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Messages', href: '/admin/messages', icon: EnvelopeIcon },
  { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
  { name: 'Reviews', href: '/admin/reviews', icon: StarIcon },
]

export function SideNavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const initial = user?.name?.charAt(0).toUpperCase() || 'A'

  return (
    <nav className="fixed left-0 top-0 h-screen w-[280px] bg-surface-container-low dark:bg-inverse-surface backdrop-blur-md border-r border-outline-variant/30 shadow-md flex flex-col z-40 hidden md:flex">
      {/* Brand — clickable to home */}
      <Link
        href="/"
        className="px-6 py-8 flex items-center gap-4 border-b border-outline-variant/30 hover:bg-surface-container transition-colors group"
        title="Go to store home"
      >
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
          A
        </div>
        <div className="flex-1">
          <h1 className="font-headline-md text-headline-md text-primary">
            Aqua Admin
          </h1>
          <p className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1">
            View Store
            <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
        </div>
      </Link>

      {/* New Listing Button */}
      <div className="px-4 py-4">
        <Link
          href="/admin/fish/add"
          className="w-full py-3 px-4 bg-gradient-to-r from-tertiary to-primary text-white rounded-xl flex items-center justify-center gap-2 font-label-sm text-label-sm shadow-md shadow-primary/20 hover:shadow-lg transition-shadow"
        >
          <PlusIcon className="w-5 h-5" />
          New Listing
        </Link>
      </div>

      {/* Navigation */}
      <ul className="flex flex-col gap-1 flex-1 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname?.startsWith(item.href))
          const Icon = isActive && item.solidIcon ? item.solidIcon : item.icon

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary hover:translate-x-1'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-label-sm text-label-sm">{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* User Profile */}
      <div className="p-4 border-t border-outline-variant/30">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container border border-outline-variant/20">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-label-sm text-label-sm text-on-surface font-semibold">
              {user?.name || 'Admin'}
            </p>
            <p className="truncate text-xs text-on-surface-variant capitalize">
              {user?.role || 'Admin'}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-on-surface-variant hover:text-error transition-colors"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}