import mongoose from 'mongoose'

export interface IReview extends mongoose.Document {
  productId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  userName: string
  userEmail: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new mongoose.Schema<IReview>(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
)

// Ensure one review per user per product
// ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true })

export default mongoose.models.Review ||
  mongoose.model<IReview>('Review', ReviewSchema)