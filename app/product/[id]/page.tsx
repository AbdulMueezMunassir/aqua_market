'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

interface Product {
  _id: string
  name: string
  scientificName: string
  category: string
  price: number
  stock: number
  status: string
  image: string
  description: string
  temperature: string
  pH: string
  tankSize: string
  maxSize: string
  diet: string
  temperament: string
  rating: number
  reviews: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addItem, getItemCount } = useCartStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (!response.ok) throw new Error('Product not found')
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Product not found')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    })
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    handleAddToCart()
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Product Not Found</h2>
          <Link href="/shop" className="text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const inCartCount = getItemCount(product._id)

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="mb-6">
        <Link href="/shop" className="text-on-surface-variant hover:text-primary transition-colors">
          ← Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <img
            src={product.image || 'https://via.placeholder.com/600x400/00696b/ffffff?text=' + product.name}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="text-label-sm text-primary mb-2 uppercase tracking-wide">
              {product.category}
            </div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              {product.name}
            </h1>
            {product.scientificName && (
              <p className="text-on-surface-variant italic mt-1">{product.scientificName}</p>
            )}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{product.rating || 0}</span>
                <span className="text-on-surface-variant">({product.reviews || 0} reviews)</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                product.status === 'Active' && product.stock > 0
                  ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                  : 'bg-error/10 text-error border border-error/20'
              }`}>
                {product.status === 'Active' && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="border-t border-outline-variant/30 pt-6">
            <span className="font-headline-md text-headline-md text-primary font-bold">
              LKR {product.price.toLocaleString()}
            </span>
            {product.stock > 0 && (
              <p className="text-sm text-on-surface-variant mt-1">{product.stock} available</p>
            )}
          </div>

          <div className="border-t border-outline-variant/30 pt-6">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-on-surface">{product.description || 'No description available.'}</p>
          </div>

          {/* Specifications */}
          <div className="border-t border-outline-variant/30 pt-6">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-4">
              Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {product.temperature && (
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-sm text-on-surface-variant">Temperature</p>
                  <p className="font-medium">{product.temperature}</p>
                </div>
              )}
              {product.pH && (
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-sm text-on-surface-variant">pH Range</p>
                  <p className="font-medium">{product.pH}</p>
                </div>
              )}
              {product.tankSize && (
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-sm text-on-surface-variant">Tank Size</p>
                  <p className="font-medium">{product.tankSize} Gal</p>
                </div>
              )}
              {product.maxSize && (
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-sm text-on-surface-variant">Max Size</p>
                  <p className="font-medium">{product.maxSize} in</p>
                </div>
              )}
              {product.diet && (
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-sm text-on-surface-variant">Diet</p>
                  <p className="font-medium">{product.diet}</p>
                </div>
              )}
              {product.temperament && (
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-sm text-on-surface-variant">Temperament</p>
                  <p className="font-medium">{product.temperament}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {product.status === 'Active' && product.stock > 0 && (
            <div className="border-t border-outline-variant/30 pt-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm text-on-surface-variant">Quantity:</label>
                <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-surface rounded-md transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-surface rounded-md transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 glass-panel py-3 rounded-xl text-primary font-medium hover:bg-white/50 transition-colors"
                >
                  {addedToCart ? '✓ Added to Cart' : inCartCount > 0 ? `Add More (${inCartCount} in Cart)` : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 btn-primary justify-center py-3"
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}