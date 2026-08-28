'use client'

import { useState } from 'react'
import { SideNavBar } from '@/components/dashboard/SideNavBar'
import { FishTable } from '@/components/dashboard/FishTable'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function FishManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  return (
    <div className="flex min-h-screen bg-background">
      <SideNavBar />
      
      <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight">
              Fish Management
            </h1>
            <p className="text-on-surface-variant font-body-md mt-2">
              Manage your premium aquatic livestock inventory.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative glass-panel rounded-full overflow-hidden flex-1 md:w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full bg-transparent border-none pl-10 pr-4 py-2 font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none placeholder-outline/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <select className="glass-panel rounded-full px-4 py-2 font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none">
              <option>All Categories</option>
              <option>Freshwater</option>
              <option>Saltwater</option>
              <option>Invertebrates</option>
              <option>Plants</option>
            </select>
            
            <Link
              href="/admin/fish/add"
              className="btn-primary px-6 py-2 text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add Fish
            </Link>
          </div>
        </div>
        
        <FishTable />
      </main>
    </div>
  )
}