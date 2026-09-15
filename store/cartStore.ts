import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
  currentUserKey: string | null
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemCount: (id: string) => number
  /**
   * Called when user logs in/out.
   * If userKey changes, load that user's cart from localStorage.
   */
  setUser: (userKey: string | null) => void
}

const getStorageKey = (userKey: string | null) =>
  `aqua-market-cart-${userKey || 'guest'}`

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currentUserKey: null,

      setUser: (userKey: string | null) => {
        const currentKey = get().currentUserKey
        if (currentKey === userKey) return

        // Save current cart under current key (handled by persist)
        // Load new user's cart from localStorage
        if (typeof window !== 'undefined') {
          const newKey = getStorageKey(userKey)
          const stored = window.localStorage.getItem(newKey)
          let newItems: CartItem[] = []
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
            items: [...items, { ...item, quantity: item.quantity || 1 }],
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
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.stock || 99) }
              : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getItemCount: (id) => {
        const item = get().items.find((i) => i.id === id)
        return item?.quantity || 0
      },
    }),
    {
      name: 'aqua-market-cart', // overridden below
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          // Resolve dynamic key based on current user
          const userKey = useCartStore.getState().currentUserKey
          return window.localStorage.getItem(getStorageKey(userKey))
        },
        setItem: (name: string, value: string) => {
          const userKey = useCartStore.getState().currentUserKey
          window.localStorage.setItem(getStorageKey(userKey), value)
        },
        removeItem: (name: string) => {
          const userKey = useCartStore.getState().currentUserKey
          window.localStorage.removeItem(getStorageKey(userKey))
        },
      })),
      partialize: (state) => ({ items: state.items }),
    }
  )
)