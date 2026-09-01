import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  items: string[]
  addItem: (id: string) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  isInWishlist: (id: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (id) => {
        set((state) => ({
          items: [...state.items, id]
        }))
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item !== id)
        }))
      },
      
      toggleItem: (id) => {
        const { items } = get()
        if (items.includes(id)) {
          set({ items: items.filter(item => item !== id) })
        } else {
          set({ items: [...items, id] })
        }
      },
      
      isInWishlist: (id) => {
        return get().items.includes(id)
      }
    }),
    {
      name: 'aqua-market-wishlist'
    }
  )
)