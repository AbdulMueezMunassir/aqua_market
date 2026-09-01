import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemCount: (id: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find((i) => i.id === item.id)
        
        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + (item.quantity || 1),
            existingItem.stock || 99
          )
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: newQuantity } : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: item.quantity || 1,
              },
            ],
          })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(quantity, item.stock || 99) } : item
          ),
        })
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      
      getItemCount: (id) => {
        const item = get().items.find((i) => i.id === id)
        return item?.quantity || 0
      },
    }),
    {
      name: 'aqua-market-cart',
    }
  )
)