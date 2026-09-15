import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface WishlistStore {
  items: string[]
  currentUserKey: string | null
  addItem: (id: string) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  setUser: (userKey: string | null) => void
}

const getStorageKey = (userKey: string | null) =>
  `aqua-market-wishlist-${userKey || 'guest'}`

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      currentUserKey: null,

      setUser: (userKey: string | null) => {
        const currentKey = get().currentUserKey
        if (currentKey === userKey) return

        if (typeof window !== 'undefined') {
          const stored = window.localStorage.getItem(getStorageKey(userKey))
          let newItems: string[] = []
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              newItems = parsed?.state?.items || parsed?.items || []
            } catch {
              newItems = []
            }
          }
          set({ currentUserKey: userKey, items: newItems })
        } else {
          set({ currentUserKey: userKey, items: [] })
        }
      },

      addItem: (id: string) => {
        const { items } = get()
        if (!items.includes(id)) {
          set({ items: [...items, id] })
        }
      },

      removeItem: (id: string) => {
        set((state) => ({ items: state.items.filter((item) => item !== id) }))
      },

      toggleItem: (id: string) => {
        const { items } = get()
        if (items.includes(id)) {
          set({ items: items.filter((item) => item !== id) })
        } else {
          set({ items: [...items, id] })
        }
      },

      isInWishlist: (id: string) => {
        return get().items.includes(id)
      },

      clearWishlist: () => {
        set({ items: [] })
      },
    }),
    {
      name: 'aqua-market-wishlist',
      storage: createJSONStorage(() => ({
        getItem: () => {
          const userKey = useWishlistStore.getState().currentUserKey
          return window.localStorage.getItem(getStorageKey(userKey))
        },
        setItem: (_, value: string) => {
          const userKey = useWishlistStore.getState().currentUserKey
          window.localStorage.setItem(getStorageKey(userKey), value)
        },
        removeItem: () => {
          const userKey = useWishlistStore.getState().currentUserKey
          window.localStorage.removeItem(getStorageKey(userKey))
        },
      })),
      partialize: (state) => ({ items: state.items }),
    }
  )
)