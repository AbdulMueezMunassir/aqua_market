'use client'

import { useState, useEffect } from 'react'
import { SideNavBar } from '@/components/dashboard/SideNavBar'
import { useAuth } from '@/context/AuthContext'

export default function AnalyticsPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <SideNavBar />
        <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SideNavBar />
      
      <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop">
        <div className="mb-8">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
            Analytics Dashboard
          </h1>
          <p className="text-on-surface-variant mt-2">Real-time business insights</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel rounded-xl p-6">
            <p className="text-sm text-on-surface-variant">Total Revenue</p>
            <p className="text-2xl font-bold text-primary">LKR {data?.totalRevenue?.toLocaleString() || 0}</p>
          </div>
          <div className="glass-panel rounded-xl p-6">
            <p className="text-sm text-on-surface-variant">Total Orders</p>
            <p className="text-2xl font-bold text-on-surface">{data?.totalOrders || 0}</p>
          </div>
          <div className="glass-panel rounded-xl p-6">
            <p className="text-sm text-on-surface-variant">Customers</p>
            <p className="text-2xl font-bold text-on-surface">{data?.activeCustomers || 0}</p>
          </div>
          <div className="glass-panel rounded-xl p-6 bg-error/5">
            <p className="text-sm text-on-surface-variant">Low Stock</p>
            <p className="text-2xl font-bold text-error">{data?.lowStockItems || 0}</p>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <h2 className="font-headline-md text-headline-md mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="p-3 text-sm text-on-surface-variant">Order</th>
                  <th className="p-3 text-sm text-on-surface-variant">Customer</th>
                  <th className="p-3 text-sm text-on-surface-variant">Amount</th>
                  <th className="p-3 text-sm text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="border-b border-outline-variant/20 hover:bg-white/40 transition-colors">
                    <td className="p-3 font-medium">{order.id}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">LKR {order.amount?.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-500/10 text-green-600' :
                        order.status === 'Processing' ? 'bg-blue-500/10 text-blue-600' :
                        order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-600' :
                        'bg-yellow-500/10 text-yellow-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}