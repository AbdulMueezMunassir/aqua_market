'use client'

import Image from 'next/image'

const orders = [
  {
    id: '#ORD-9082',
    customer: 'Sarah Jenkins',
    date: 'Oct 24, 2024',
    amount: 'LKR 14,550',
    status: 'Processing',
    statusColor: 'bg-[#00ced1]/20 text-on-secondary-container'
  },
  {
    id: '#ORD-9081',
    customer: 'Michael Torres',
    date: 'Oct 24, 2024',
    amount: 'LKR 8,900',
    status: 'Shipped',
    statusColor: 'bg-[#00696b] text-white'
  },
  {
    id: '#ORD-9080',
    customer: 'David Chen',
    date: 'Oct 23, 2024',
    amount: 'LKR 31,275',
    status: 'Delivered',
    statusColor: 'bg-outline-variant/30 text-on-surface-variant'
  },
]

export function DataTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/40 border-b border-outline-variant/30 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
            <th className="p-4 font-medium">Order ID</th>
            <th className="p-4 font-medium">Customer</th>
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 font-medium">Amount</th>
            <th className="p-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="font-body-md text-body-md text-on-surface">
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-outline-variant/20 hover:bg-white/40 transition-colors">
              <td className="p-4 font-medium text-primary">{order.id}</td>
              <td className="p-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center font-bold text-label-sm">
                  {order.customer.split(' ').map((n) => n[0]).join('')}
                </div>
                {order.customer}
              </td>
              <td className="p-4 text-on-surface-variant">{order.date}</td>
              <td className="p-4 font-medium">{order.amount}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${order.statusColor}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}