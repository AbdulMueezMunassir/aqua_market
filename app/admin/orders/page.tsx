'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  orderId: string
  customer: string
  email: string
  phone: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  shipping: {
    address: string
    city: string
    state?: string
    zipCode?: string
  }
  notes?: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
  Processing: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  Shipped: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
  Delivered: 'bg-green-500/10 text-green-600 border border-green-500/20',
  Cancelled: 'bg-red-500/10 text-red-600 border border-red-500/20',
}

const paymentStatusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
  Paid: 'bg-green-500/10 text-green-600 border border-green-500/20',
  Failed: 'bg-red-500/10 text-red-600 border border-red-500/20',
  Cancelled: 'bg-gray-500/10 text-gray-600 border border-gray-500/20',
}

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const updateStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const paymentOptions = ['Pending', 'Paid', 'Failed', 'Cancelled']

export default function AdminOrdersPage() {
  const { token } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'All') params.set('status', statusFilter)
      if (searchTerm.trim()) params.set('search', searchTerm)

      const url = `/api/admin/orders${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data)
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token, statusFilter, searchTerm])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateOrderStatus = async (
    id: string,
    updates: { status?: string; paymentStatus?: string }
  ) => {
    setUpdatingId(id)
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...updates }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update order')
      }

      const updated = await response.json()

      // Update local state
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...updated } : o)))
      if (selectedOrder?._id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, ...updated } : prev))
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    try {
      const response = await fetch(`/api/admin/orders?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to delete order')
      setOrders((prev) => prev.filter((o) => o._id !== id))
      setShowModal(false)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrders()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('All')
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight">
            Order Management
          </h1>
          <p className="text-on-surface-variant font-body-md mt-2">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 glass-panel rounded-xl">
        <form onSubmit={handleSearch} className="relative flex-1 min-w-[220px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Search by order ID, customer, email..."
            className="w-full bg-surface-container-low rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <select
          className="bg-surface-container-low rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none min-w-[150px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s === 'All' ? 'All Statuses' : s}
            </option>
          ))}
        </select>

        {(searchTerm || statusFilter !== 'All') && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        )}

        <span className="text-sm text-on-surface-variant ml-auto">
          {orders.length} result{orders.length !== 1 ? 's' : ''}
        </span>
      </div>

      {error && (
        <div className="bg-error-container/20 text-error p-4 rounded-lg mb-6 border border-error/20">
          {error}
        </div>
      )}

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-on-surface-variant mb-2">No orders found</p>
          <p className="text-sm text-on-surface-variant">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-white/40 text-on-surface-variant text-xs font-medium bg-surface/30">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Payment</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-white/30">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/40 transition-colors group"
                  >
                    <td className="py-3 px-6 font-medium text-primary">
                      #{order.orderId}
                    </td>
                    <td className="py-3 px-6">
                      <div className="font-medium text-on-surface">
                        {order.customer}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        {order.email}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-on-surface-variant">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-right font-medium">
                      LKR {order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, { status: e.target.value })
                        }
                        disabled={updatingId === order._id}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary outline-none ${
                          statusColors[order.status] ||
                          statusColors['Pending']
                        } ${updatingId === order._id ? 'opacity-50' : ''}`}
                      >
                        {updateStatusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          updateOrderStatus(order._id, {
                            paymentStatus: e.target.value,
                          })
                        }
                        disabled={updatingId === order._id}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-primary outline-none ${
                          paymentStatusColors[order.paymentStatus] ||
                          paymentStatusColors['Pending']
                        } ${updatingId === order._id ? 'opacity-50' : ''}`}
                      >
                        {paymentOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowModal(true)
                          }}
                          className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-primary-container/20 transition-colors"
                          title="View details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="p-1.5 text-on-surface-variant hover:text-error rounded-md hover:bg-error-container/50 transition-colors"
                          title="Delete order"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-headline-md">Order Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-on-surface-variant hover:text-primary transition-colors p-1"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="font-medium text-primary">#{selectedOrder.orderId}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                    Date
                  </p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                    Customer
                  </p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p className="text-sm text-on-surface-variant">
                    {selectedOrder.email}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {selectedOrder.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider">
                    Payment Method
                  </p>
                  <p className="font-medium capitalize">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-2">
                  Shipping Address
                </p>
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p>{selectedOrder.shipping.address}</p>
                  <p>
                    {[
                      selectedOrder.shipping.city,
                      selectedOrder.shipping.state,
                      selectedOrder.shipping.zipCode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-2">
                  Items
                </p>
                <div className="bg-surface-container-low rounded-lg divide-y divide-outline-variant/20">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-on-surface-variant">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 text-sm text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>LKR {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 text-sm text-on-surface-variant">
                    <span>Delivery</span>
                    <span>
                      LKR {selectedOrder.deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 text-sm text-on-surface-variant">
                    <span>Tax</span>
                    <span>LKR {selectedOrder.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 font-bold border-t-2 border-outline-variant/30">
                    <span>Total</span>
                    <span className="text-primary">
                      LKR {selectedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-2">
                    Order Notes
                  </p>
                  <p className="text-sm bg-surface-container-low rounded-lg p-3">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Update Status */}
              <div className="pt-4 border-t border-outline-variant/30 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-on-surface-variant uppercase tracking-wider mb-2 block">
                    Order Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      updateOrderStatus(selectedOrder._id, {
                        status: e.target.value,
                      })
                    }
                    disabled={updatingId === selectedOrder._id}
                    className="w-full bg-surface-container-low rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    {updateStatusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-on-surface-variant uppercase tracking-wider mb-2 block">
                    Payment Status
                  </label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) =>
                      updateOrderStatus(selectedOrder._id, {
                        paymentStatus: e.target.value,
                      })
                    }
                    disabled={updatingId === selectedOrder._id}
                    className="w-full bg-surface-container-low rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    {paymentOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => deleteOrder(selectedOrder._id)}
                  className="flex-1 px-6 py-3 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-colors"
                >
                  Delete Order
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-primary justify-center py-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}