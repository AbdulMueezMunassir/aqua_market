'use server'

import { connectToDatabase } from '@/lib/mongodb'
import Review from '@/models/Review'
import Product from '@/models/Product'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────
export type ActionResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
}

export interface ReviewData {
  _id: string
  productId: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  comment: string
  createdAt: string
}

// ────────────────────────────────────────────────────────────
// Verify JWT from token string
// ────────────────────────────────────────────────────────────
function verifyToken(token: string | null) {
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
  } catch {
    return null
  }
}

// ────────────────────────────────────────────────────────────
// Recalculate product rating
// ────────────────────────────────────────────────────────────
async function recalculateProductRating(productId: string) {
  const reviews = await Review.find({ productId })

  const reviewCount = reviews.length
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(avgRating * 10) / 10,
    reviews: reviewCount,
  })

  return { rating: avgRating, reviews: reviewCount }
}

// ────────────────────────────────────────────────────────────
// GET REVIEWS for a product
// ────────────────────────────────────────────────────────────
export async function getReviewsAction(
  productId: string
): Promise<ActionResponse<ReviewData[]>> {
  try {
    console.log('🟢 getReviewsAction called for:', productId)
    await connectToDatabase()

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .lean()

    const serialized: ReviewData[] = reviews.map((r: any) => ({
      _id: r._id.toString(),
      productId: r.productId.toString(),
      userId: r.userId.toString(),
      userName: r.userName,
      userEmail: r.userEmail,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }))

    console.log(`✅ Returning ${serialized.length} reviews`)
    return { success: true, data: serialized }
  } catch (error: any) {
    console.error('❌ getReviewsAction error:', error)
    return { success: false, error: error.message || 'Failed to load reviews' }
  }
}

// ────────────────────────────────────────────────────────────
// CREATE REVIEW
// ────────────────────────────────────────────────────────────
export async function createReviewAction(
  token: string | null,
  productId: string,
  rating: number,
  comment: string
): Promise<ActionResponse<ReviewData>> {
  try {
    console.log('🟡 createReviewAction called')
    console.log('  Product:', productId)
    console.log('  Rating:', rating)
    console.log('  Comment length:', comment.length)

    const user = verifyToken(token)
    if (!user) {
      return { success: false, error: 'Please login to leave a review' }
    }
    console.log('  User:', user.email)

    await connectToDatabase()

    // Validate
    if (!productId) {
      return { success: false, error: 'Product ID is required' }
    }

    const numRating = Number(rating)
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' }
    }

    if (!comment || !comment.trim()) {
      return { success: false, error: 'Comment is required' }
    }

    if (comment.length > 1000) {
      return { success: false, error: 'Comment cannot exceed 1000 characters' }
    }

    // Verify product exists
    const product = await Product.findById(productId)
    if (!product) {
      return { success: false, error: 'Product not found' }
    }

    // Check for existing review
    const existing = await Review.findOne({
      productId,
      userId: user.id,
    })
    if (existing) {
      return {
        success: false,
        error: 'You have already reviewed this product',
      }
    }

    // Create review
    const review = await Review.create({
      productId,
      userId: user.id,
      userName: user.name || 'Anonymous',
      userEmail: user.email,
      rating: numRating,
      comment: comment.trim(),
    })

    console.log('✅ Review created:', review._id.toString())

    // Recalculate rating
    const stats = await recalculateProductRating(productId)
    console.log(`✅ Product rating: ${stats.rating.toFixed(1)} (${stats.reviews})`)

    const serialized: ReviewData = {
      _id: review._id.toString(),
      productId: review.productId.toString(),
      userId: review.userId.toString(),
      userName: review.userName,
      userEmail: review.userEmail,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
    }

    return { success: true, data: serialized }
  } catch (error: any) {
    console.error('❌ createReviewAction error:', error)

    if (error.code === 11000) {
      return {
        success: false,
        error: 'You have already reviewed this product',
      }
    }

    return {
      success: false,
      error: error.message || 'Failed to create review',
    }
  }
}

// ────────────────────────────────────────────────────────────
// DELETE REVIEW
// ────────────────────────────────────────────────────────────
export async function deleteReviewAction(
  token: string | null,
  reviewId: string
): Promise<ActionResponse> {
  try {
    const user = verifyToken(token)
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    await connectToDatabase()

    const review = await Review.findById(reviewId)
    if (!review) {
      return { success: false, error: 'Review not found' }
    }

    const isOwner = review.userId.toString() === user.id
    const isAdmin = user.role === 'admin'
    if (!isOwner && !isAdmin) {
      return { success: false, error: 'You can only delete your own reviews' }
    }

    const productId = review.productId.toString()
    await Review.findByIdAndDelete(reviewId)
    await recalculateProductRating(productId)

    console.log(`🗑️ Review ${reviewId} deleted by ${user.email}`)
    return { success: true }
  } catch (error: any) {
    console.error('❌ deleteReviewAction error:', error)
    return { success: false, error: error.message || 'Failed to delete review' }
  }
}