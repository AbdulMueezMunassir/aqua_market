'use client'

import { SideNavBar } from '@/components/dashboard/SideNavBar'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <SideNavBar />
      
      <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop pb-16">
        <header className="mb-8">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
            Dashboard Overview
          </h1>
          <p className="text-on-surface-variant font-body-md mt-2">
            Welcome back, Admin
          </p>
        </header>
        
        <AnalyticsChart />
      </main>
    </div>
  )
}