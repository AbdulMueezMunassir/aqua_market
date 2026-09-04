import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  items: string[]
  addItem: (id: string) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (id: string) => {
        const { items } = get()
        if (!items.includes(id)) {
          set({ items: [...items, id] })
        }
      },
      
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter(item => item !== id)
        }))
      },
      
      toggleItem: (id: string) => {
        const { items } = get()
        if (items.includes(id)) {
          set({ items: items.filter(item => item !== id) })
        } else {
          set({ items: [...items, id] })
        }
      },
      
      isInWishlist: (id: string) => {
        return get().items.includes(id)
      },
      
      clearWishlist: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'aqua-market-wishlist',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          try {
            return JSON.parse(str)
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        }
      }
    }
  )
)