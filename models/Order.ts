import mongoose from 'mongoose'

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  name: string
  quantity: number
  price: number
}

export interface IOrder extends mongoose.Document {
  orderId: string
  userId: mongoose.Types.ObjectId
  customer: string
  email: string
  phone: string
  items: IOrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  paymentMethod: 'card' | 'bank' | 'cod'
  paymentStatus: 'Pending' | 'Paid' | 'Failed'
  shipping: {
    address: string
    city: string
    state: string
    zipCode: string
  }
  notes: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'bank', 'cod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    shipping: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

// Generate order ID before saving
OrderSchema.pre('save', function (next) {
  if (!this.orderId) {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    this.orderId = `ORD-${year}${month}${day}-${random}`
  }
  next()
})

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)