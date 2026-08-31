import mongoose from 'mongoose'

export interface IProduct extends mongoose.Document {
  name: string
  scientificName: string
  category: string
  price: number
  stock: number
  status: 'Active' | 'Inactive' | 'Out of Stock'
  image: string
  images: string[]
  description: string
  temperature: string
  pH: string
  tankSize: string
  maxSize: string
  diet: string
  temperament: string
  rating: number
  reviews: number
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    scientificName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Freshwater', 'Saltwater', 'Brackish', 'Invertebrates', 'Plants', 'Equipment'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Out of Stock'],
      default: 'Active',
    },
    image: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    temperature: {
      type: String,
      default: '',
    },
    pH: {
      type: String,
      default: '',
    },
    tankSize: {
      type: String,
      default: '',
    },
    maxSize: {
      type: String,
      default: '',
    },
    diet: {
      type: String,
      enum: ['Omnivore', 'Carnivore', 'Herbivore', ''],
      default: '',
    },
    temperament: {
      type: String,
      enum: ['Peaceful', 'Semi-Aggressive', 'Aggressive', ''],
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)