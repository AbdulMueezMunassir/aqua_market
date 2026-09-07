'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  _id: string
  orderId: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  status: string
  createdAt: string
  paymentMethod: string
  shipping: { address: string; city: string; state: string; zipCode: string }
}

const statusColors: Record<string, string> = {
  'Pending': 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
  'Processing': 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  'Shipped': 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
  'Delivered': 'bg-green-500/10 text-green-600 border border-green-500/20',
  'Cancelled': 'bg-red-500/10 text-red-600 border border-red-500/20',
}

export default function OrdersPage() {
  const { user, token, isAuthenticated } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    fetchOrders()
  }, [isAuthenticated, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary">
            My Orders
          </h1>
          <p className="text-on-surface-variant mt-2">
            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </p>
        </div>
        <Link href="/shop" className="text-primary hover:underline text-sm">
          Continue Shopping →
        </Link>
      </div>

      {error && (
        <div className="bg-error-container/20 text-error p-4 rounded-lg mb-6 border border-error/20">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-outline mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <h2 className="font-headline-md text-headline-md mb-2">No Orders Yet</h2>
          <p className="text-on-surface-variant mb-6">Start shopping to place your first order!</p>
          <Link href="/shop" className="btn-primary inline-flex">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="glass-panel rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-sm text-on-surface-variant">Order #{order.orderId}</p>
                  <p className="text-sm text-on-surface-variant">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || statusColors['Pending']}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-primary">LKR {order.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-4">
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="text-on-surface-variant">LKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-outline-variant/30 mt-4 pt-4 flex flex-wrap justify-between items-center text-sm">
                <div>
                  <span className="text-on-surface-variant">Payment: </span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant">Deliver to: </span>
                  <span>{order.shipping.address}, {order.shipping.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}