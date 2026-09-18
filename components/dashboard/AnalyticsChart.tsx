'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface RevenueMonth {
  month: string
  revenue: number
}

interface TopProduct {
  name: string
  sales: number
  revenue: number
}

interface RecentOrder {
  id: string
  customer: string
  amount: number
  status: string
  date: string
}

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  activeCustomers: number
  lowStockItems: number
  revenueByMonth: RevenueMonth[]
  topProducts: TopProduct[]
  recentOrders: RecentOrder[]
}

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-600',
  Processing: 'bg-blue-500/10 text-blue-600',
  Shipped: 'bg-purple-500/10 text-purple-600',
  Delivered: 'bg-green-500/10 text-green-600',
  Cancelled: 'bg-red-500/10 text-red-600',
}

export function AnalyticsChart() {
  const { token } = useAuth()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    fetchAnalytics()
  }, [token])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required')
        }
        throw new Error('Failed to fetch analytics')
      }

      const result = await response.json()
      console.log('📊 Analytics loaded:', result)
      setData(result)
    } catch (error: any) {
      console.error('Error fetching analytics:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center">
        <p className="text-error mb-2">Error: {error}</p>
        <button onClick={fetchAnalytics} className="btn-primary mt-4">
          Try Again
        </button>
      </div>
    )
  }

  if (!data) return null

  // Guard against empty data
  const hasRevenue = data.revenueByMonth?.length > 0
  const maxRevenue = hasRevenue
    ? Math.max(...data.revenueByMonth.map((d) => d.revenue), 1)
    : 1

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-6">
          <p className="text-sm text-on-surface-variant">Total Revenue</p>
          <p className="font-display-lg-mobile text-display-lg-mobile text-primary font-bold mt-1">
            LKR {data.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="glass-panel rounded-xl p-6">
          <p className="text-sm text-on-surface-variant">Total Orders</p>
          <p className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-bold mt-1">
            {data.totalOrders.toLocaleString()}
          </p>
        </div>
        <div className="glass-panel rounded-xl p-6">
          <p className="text-sm text-on-surface-variant">Active Customers</p>
          <p className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-bold mt-1">
            {data.activeCustomers.toLocaleString()}
          </p>
        </div>
        <div
          className={`glass-panel rounded-xl p-6 ${
            data.lowStockItems > 0 ? 'bg-error/5 border-error/20' : ''
          }`}
        >
          <p className="text-sm text-on-surface-variant">Low Stock Items</p>
          <p
            className={`font-display-lg-mobile text-display-lg-mobile font-bold mt-1 ${
              data.lowStockItems > 0 ? 'text-error' : 'text-on-surface'
            }`}
          >
            {data.lowStockItems}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline-md text-headline-md">
            Revenue — Last 12 Months
          </h3>
          <span className="text-xs text-on-surface-variant">
            Total: LKR {data.totalRevenue.toLocaleString()}
          </span>
        </div>
        <div className="h-64 flex items-end gap-2">
          {data.revenueByMonth.map((item, i) => {
            const height = item.revenue > 0
              ? (item.revenue / maxRevenue) * 100
              : 2
            return (
              <div
                key={`${item.month}-${i}`}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div className="w-full flex items-end h-full relative">
                  <div
                    className={`w-full rounded-t transition-all ${
                      item.revenue > 0
                        ? 'bg-primary/60 hover:bg-primary'
                        : 'bg-surface-container-high'
                    }`}
                    style={{ height: `${height}%` }}
                    title={`${item.month}: LKR ${item.revenue.toLocaleString()}`}
                  />
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    LKR {item.revenue.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs text-on-surface-variant">
                  {item.month}
                </span>
              </div>
            )
          })}
        </div>
        {data.totalOrders === 0 && (
          <p className="text-center text-sm text-on-surface-variant mt-4">
            No orders yet — revenue will appear here once orders are placed.
          </p>
        )}
      </div>

      {/* Top Products */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-headline-md text-headline-md mb-6">
          Top Products
        </h3>
        {data.topProducts.length === 0 ? (
          <p className="text-center text-sm text-on-surface-variant py-8">
            No sales data yet — place an order to populate this list.
          </p>
        ) : (
          <div className="space-y-3">
            {data.topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-on-surface-variant">
                      {product.sales} sold
                    </p>
                  </div>
                </div>
                <p className="font-bold text-primary">
                  LKR {product.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-headline-md text-headline-md mb-6">
          Recent Orders
        </h3>
        {data.recentOrders.length === 0 ? (
          <p className="text-center text-sm text-on-surface-variant py-8">
            No recent orders.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="p-3 text-sm text-on-surface-variant font-medium">
                    Order
                  </th>
                  <th className="p-3 text-sm text-on-surface-variant font-medium">
                    Customer
                  </th>
                  <th className="p-3 text-sm text-on-surface-variant font-medium text-right">
                    Amount
                  </th>
                  <th className="p-3 text-sm text-on-surface-variant font-medium text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-outline-variant/20 hover:bg-white/40 transition-colors"
                  >
                    <td className="p-3 font-medium text-primary">
                      {order.id}
                    </td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3 text-right font-medium">
                      LKR {order.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[order.status] ||
                          statusColors['Pending']
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}