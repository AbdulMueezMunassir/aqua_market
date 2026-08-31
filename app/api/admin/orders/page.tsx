'use client'

import { useState, useEffect } from 'react'
import { SideNavBar } from '@/components/dashboard/SideNavBar'
import { MagnifyingGlassIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Order {
  id: string
  customer: string
  email: string
  date: string
  amount: number
  status: string
  items: Array<{ name: string; quantity: number; price: number }>
  shipping: {
    address: string
    city: string
    state: string
    zip: string
  }
}

const statusColors: Record<string, string> = {
  'Pending': 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
  'Processing': 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
  'Shipped': 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
  'Delivered': 'bg-green-500/10 text-green-600 border border-green-500/20',
  'Cancelled': 'bg-red-500/10 text-red-600 border border-red-500/20'
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      if (response.ok) {
        await fetchOrders()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return
    
    try {
      const response = await fetch(`/api/admin/orders?id=${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchOrders()
      }
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  return (
    <div className="flex min-h-screen bg-background">
      <SideNavBar />
      
      <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight">
              Order Management
            </h1>
            <p className="text-on-surface-variant font-body-md mt-2">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative glass-panel rounded-full overflow-hidden flex-1 md:w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full bg-transparent border-none pl-10 pr-4 py-2 font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none placeholder-outline/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="glass-panel rounded-full px-4 py-2 font-body-md text-on-surface focus:ring-1 focus:ring-primary outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-white/40 text-on-surface-variant font-label-sm text-label-sm bg-surface/30">
                    <th className="py-4 px-6 font-medium">Order ID</th>
                    <th className="py-4 px-6 font-medium">Customer</th>
                    <th className="py-4 px-6 font-medium">Date</th>
                    <th className="py-4 px-6 font-medium text-right">Amount</th>
                    <th className="py-4 px-6 font-medium text-center">Status</th>
                    <th className="py-4 px-6 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body-md divide-y divide-white/30">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/40 transition-colors group">
                      <td className="py-3 px-6 font-medium text-primary">{order.id}</td>
                      <td className="py-3 px-6">
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-xs text-on-surface-variant">{order.email}</div>
                      </td>
                      <td className="py-3 px-6 text-on-surface-variant">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6 text-right font-medium">
                        LKR {order.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || statusColors['Pending']}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowModal(true)
                            }}
                            className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-primary-container/20 transition-colors"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              const newStatus = window.prompt('Update order status:', order.status)
                              if (newStatus && statusOptions.includes(newStatus)) {
                                updateOrderStatus(order.id, newStatus)
                              }
                            }}
                            className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-primary-container/20 transition-colors"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-1.5 text-on-surface-variant hover:text-error rounded-md hover:bg-error-container/50 transition-colors"
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
            
            <div className="p-4 border-t border-white/40 flex items-center justify-between text-sm text-on-surface-variant">
              <div>Showing {filteredOrders.length} of {orders.length} orders</div>
              <div className="flex gap-1">
                <button className="px-3 py-1 rounded-md hover:bg-white/50 transition-colors disabled:opacity-50" disabled>
                  &lt;
                </button>
                <button className="px-3 py-1 rounded-md bg-primary text-white font-medium">1</button>
                <button className="px-3 py-1 rounded-md hover:bg-white/50 transition-colors">2</button>
                <button className="px-3 py-1 rounded-md hover:bg-white/50 transition-colors">3</button>
                <button className="px-3 py-1 rounded-md hover:bg-white/50 transition-colors">&gt;</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline-md text-headline-md">Order Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-on-surface-variant">Order ID</p>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${statusColors[selectedOrder.status] || statusColors['Pending']}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Customer</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p className="text-sm text-on-surface-variant">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Date</p>
                  <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-on-surface-variant mb-2">Shipping Address</p>
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p>{selectedOrder.shipping.address}</p>
                  <p>{selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.zip}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-on-surface-variant mb-2">Items</p>
                <div className="bg-surface-container-low rounded-lg divide-y divide-outline-variant/20">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-on-surface-variant">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">LKR {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 font-bold border-t-2 border-outline-variant/30">
                    <span>Total</span>
                    <span className="text-primary">LKR {selectedOrder.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  className="flex-1 bg-surface-container-low rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                >
                  {statusOptions.filter(s => s !== 'All').map(status => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setShowModal(false)
                  }}
                  className="px-6 py-2 rounded-xl btn-primary"
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