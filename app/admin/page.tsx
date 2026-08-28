'use client'

import { SideNavBar } from '@/components/dashboard/SideNavBar'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { DataTable } from '@/components/dashboard/DataTable'
import { 
  CurrencyRupeeIcon, 
  ShoppingBagIcon, 
  UsersIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

const stats = [
  {
    title: 'Total Revenue',
    value: 'LKR 2,459,200',
    icon: CurrencyRupeeIcon,
    trend: '+12.5%',
    trendUp: true,
    color: 'primary'
  },
  {
    title: 'Total Orders',
    value: '1,248',
    icon: ShoppingBagIcon,
    trend: '+5.2%',
    trendUp: true,
    color: 'tertiary'
  },
  {
    title: 'Active Customers',
    value: '8,432',
    icon: UsersIcon,
    trend: '+8.1%',
    trendUp: true,
    color: 'secondary'
  },
  {
    title: 'Low Stock Items',
    value: '14',
    icon: ExclamationTriangleIcon,
    trend: 'Action Needed',
    trendUp: false,
    color: 'error'
  },
]

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <SideNavBar />
      
      <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
              Dashboard Overview
            </h1>
            <p className="text-on-surface-variant font-body-md mt-2">
              Welcome back, Admin
            </p>
          </div>
          <button className="btn-primary px-6 py-2 text-sm">
            Export Report
          </button>
        </header>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-8">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
        
        {/* Recent Orders */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-white/30">
            <h2 className="font-headline-md text-headline-md text-on-surface">Recent Orders</h2>
            <button className="btn-primary px-4 py-2 text-sm">
              View All
            </button>
          </div>
          <DataTable />
        </div>
      </main>
    </div>
  )
}