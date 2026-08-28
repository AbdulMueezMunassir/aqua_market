'use client'

import Image from 'next/image'
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const fishData = [
  {
    id: 1,
    name: 'Royal Gramma',
    scientificName: 'Gramma loreto',
    category: 'Saltwater',
    price: 8500,
    stock: 12,
    status: 'Active',
    image: '/images/royal-gramma.jpg'
  },
  {
    id: 2,
    name: 'Neon Tetra',
    scientificName: 'Paracheirodon innesi',
    category: 'Freshwater',
    price: 300,
    stock: 145,
    status: 'Active',
    image: '/images/neon-tetra.jpg'
  },
  {
    id: 3,
    name: 'Crystal Red Shrimp',
    scientificName: 'Caridina cantonensis',
    category: 'Invertebrates',
    price: 1500,
    stock: 0,
    status: 'Out of Stock',
    image: '/images/crystal-red-shrimp.jpg'
  },
]

export function FishTable() {
  return (
    <div className="glass-panel rounded-xl overflow-x-auto w-full">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-white/40 text-on-surface-variant font-label-sm text-label-sm bg-surface/30">
            <th className="py-4 px-6 font-medium">Image</th>
            <th className="py-4 px-6 font-medium">Fish Name</th>
            <th className="py-4 px-6 font-medium">Category</th>
            <th className="py-4 px-6 font-medium text-right">Price</th>
            <th className="py-4 px-6 font-medium text-right">Stock</th>
            <th className="py-4 px-6 font-medium text-center">Status</th>
            <th className="py-4 px-6 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="font-body-md divide-y divide-white/30">
          {fishData.map((fish) => (
            <tr key={fish.id} className="hover:bg-white/40 transition-colors group">
              <td className="py-3 px-6">
                <Image
                  src={fish.image}
                  alt={fish.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-lg object-cover shadow-sm"
                />
              </td>
              <td className="py-3 px-6">
                <div className="font-semibold text-on-surface">{fish.name}</div>
                <div className="text-xs text-on-surface-variant mt-0.5 italic">{fish.scientificName}</div>
              </td>
              <td className="py-3 px-6 text-on-surface-variant">{fish.category}</td>
              <td className="py-3 px-6 text-right font-medium">LKR {fish.price.toLocaleString()}</td>
              <td className={`py-3 px-6 text-right ${fish.stock === 0 ? 'text-error font-medium' : ''}`}>
                {fish.stock}
              </td>
              <td className="py-3 px-6 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  fish.status === 'Active'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-error/10 text-error border border-error/20'
                }`}>
                  {fish.status}
                </span>
              </td>
              <td className="py-3 px-6 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-primary-container/20 transition-colors">
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button className="p-1.5 text-on-surface-variant hover:text-primary rounded-md hover:bg-primary-container/20 transition-colors">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button className="p-1.5 text-on-surface-variant hover:text-error rounded-md hover:bg-error-container/50 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="p-4 border-t border-white/40 flex items-center justify-between text-sm text-on-surface-variant">
        <div>Showing 1 to 4 of 24 entries</div>
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
  )
}