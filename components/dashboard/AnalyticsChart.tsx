'use client'

import { useState, useEffect } from 'react'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  activeCustomers: number
  lowStockItems: number
  revenueByMonth: Array<{ month: string; revenue: number }>
  topProducts: Array<{ name: string; sales: number; revenue: number }>
}

export function AnalyticsChart() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!data) return null

  const maxRevenue = Math.max(...data.revenueByMonth.map(d => d.revenue))

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-6">
          <p className="text-sm text-on-surface-variant">Total Revenue</p>
          <p className="font-display-lg-mobile text-display-lg-mobile text-primary font-bold">
            LKR {data.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="glass-panel rounded-xl p-6">
          <p className="text-sm text-on-surface-variant">Total Orders</p>
          <p className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-bold">
            {data.totalOrders.toLocaleString()}
          </p>
        </div>
        <div className="glass-panel rounded-xl p-6">
          <p className="text-sm text-on-surface-variant">Active Customers</p>
          <p className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-bold">
            {data.activeCustomers.toLocaleString()}
          </p>
        </div>
        <div className="glass-panel rounded-xl p-6 bg-error/5 border-error/20">
          <p className="text-sm text-on-surface-variant">Low Stock Items</p>
          <p className="font-display-lg-mobile text-display-lg-mobile text-error font-bold">
            {data.lowStockItems}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-headline-md text-headline-md mb-6">Revenue Overview</h3>
        <div className="h-64 flex items-end gap-2">
          {data.revenueByMonth.map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-primary/30 hover:bg-primary/50 transition-colors rounded-t"
                style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
              />
              <span className="text-xs text-on-surface-variant">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-headline-md text-headline-md mb-6">Top Products</h3>
        <div className="space-y-4">
          {data.topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-on-surface-variant">{product.sales} sales</p>
              </div>
              <p className="font-bold text-primary">LKR {product.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}