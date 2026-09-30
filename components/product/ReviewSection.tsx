'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import {
  getReviewsAction,
  createReviewAction,
  deleteReviewAction,
  type ReviewData,
} from '@/app/actions/reviews'

interface ReviewSectionProps {
  productId: string
}

// ────────────────────────────────────────────────────────────
// Star rating display
// ────────────────────────────────────────────────────────────
function StarDisplay({
  rating,
  size = 'md',
}: {
  rating: number
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size]

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1.5}
          className={`${sizeClass} ${
            star <= Math.round(rating) ? 'text-yellow-500' : 'text-outline'
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      ))}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Interactive star picker
// ────────────────────────────────────────────────────────────
function StarPicker({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
          aria-label={`Rate ${star}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={star <= (hover || value) ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.5}
            className={`w-7 h-7 ${
              star <= (hover || value) ? 'text-yellow-500' : 'text-outline'
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </button>
      ))}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────
export function ReviewSection({ productId }: ReviewSectionProps) {
  const { user, token, isAuthenticated } = useAuth()

  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [formRating, setFormRating] = useState(5)
  const [formComment, setFormComment] = useState('')
  const [formError, setFormError] = useState('')
  const [isPending, startTransition] = useTransition()

  // Fetch reviews on mount
  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getReviewsAction(productId)
      if (result.success && result.data) {
        setReviews(result.data)
      } else {
        setError(result.error || 'Failed to load reviews')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Compute stats
  const totalReviews = reviews.length
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews
      : 0

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length
    return {
      stars,
      count,
      pct: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    }
  })

  const userReview = user ? reviews.find((r) => r.userId === user.id) : null
  const canReview = isAuthenticated && !userReview

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!formComment.trim()) {
      setFormError('Please write a comment')
      return
    }

    startTransition(async () => {
      const result = await createReviewAction(
        token,
        productId,
        formRating,
        formComment.trim()
      )

      if (!result.success) {
        setFormError(result.error || 'Failed to submit review')
        return
      }

      setFormRating(5)
      setFormComment('')
      setShowForm(false)
      await fetchReviews()
    })
  }

  // Delete
  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete your review?')) return

    startTransition(async () => {
      const result = await deleteReviewAction(token, reviewId)
      if (!result.success) {
        alert(result.error || 'Failed to delete')
        return
      }
      await fetchReviews()
    })
  }

  if (loading) {
    return (
      <div className="border-t border-outline-variant/30 pt-6 mt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-surface-container-high rounded" />
          <div className="h-20 bg-surface-container-high rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-outline-variant/30 pt-6 mt-6">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
        Customer Reviews
      </h3>

      {error && (
        <div className="bg-error-container/20 text-error p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Summary */}
      {totalReviews > 0 && (
        <div className="bg-surface-container-low rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center md:border-r border-outline-variant/30">
              <p className="font-display-lg-mobile text-display-lg-mobile text-primary font-bold">
                {avgRating.toFixed(1)}
              </p>
              <div className="my-2">
                <StarDisplay rating={avgRating} />
              </div>
              <p className="text-sm text-on-surface-variant">
                Based on {totalReviews} review
                {totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="space-y-2">
              {distribution.map(({ stars, count, pct }) => (
                <div key={stars} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-on-surface-variant">{stars}★</span>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-on-surface-variant">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {canReview && (
        <div className="mb-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full btn-primary justify-center py-3"
            >
              ✍️ Write a Review
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-surface-container-low rounded-xl p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">
                  Your Rating
                </label>
                <StarPicker value={formRating} onChange={setFormRating} />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-surface rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  placeholder="Share your experience with this product..."
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  maxLength={1000}
                  disabled={isPending}
                />
                <p className="text-xs text-on-surface-variant mt-1">
                  {formComment.length}/1000 characters
                </p>
              </div>

              {formError && (
                <div className="bg-error-container/20 text-error p-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormError('')
                    setFormComment('')
                    setFormRating(5)
                  }}
                  disabled={isPending}
                  className="flex-1 px-6 py-3 rounded-xl border border-outline-variant text-on-surface hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 btn-primary justify-center py-3"
                >
                  {isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Login CTA */}
      {!isAuthenticated && (
        <div className="bg-surface-container-low rounded-xl p-6 mb-6 text-center">
          <p className="text-on-surface-variant mb-3">
            Want to share your experience?
          </p>
          <Link href="/auth/login" className="btn-primary inline-flex">
            Login to Review
          </Link>
        </div>
      )}

      {/* Already reviewed */}
      {userReview && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-primary">
          ✅ You have already reviewed this product.
        </div>
      )}

      {/* Review list */}
      {totalReviews === 0 ? (
        <div className="bg-surface-container-low rounded-xl p-8 text-center">
          <p className="text-on-surface-variant mb-2">No reviews yet</p>
          <p className="text-sm text-on-surface-variant">
            Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-surface-container-low rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-on-surface">
                      {review.userName}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {(user?.id === review.userId || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    disabled={isPending}
                    className="text-xs text-error hover:underline disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>

              <StarDisplay rating={review.rating} size="sm" />

              <p className="mt-3 text-on-surface whitespace-pre-wrap">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}