import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  role: 'admin' | 'staff' | 'customer'
  avatar?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'staff', 'customer'],
      default: 'customer',
    },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

// COMPLETELY REWRITTEN: Pre-save hook without callback
UserSchema.pre('save', function(next) {
  const user = this
  
  // Only hash if password is modified
  if (!user.isModified('password')) {
    return next()
  }

  // Use try-catch with async/await pattern but handle properly
  (async () => {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(user.password, salt)
      user.password = hashedPassword
      console.log('✅ Password hashed successfully for:', user.email)
      next()
    } catch (error: any) {
      console.error('❌ Error hashing password:', error)
      next(error)
    }
  })()
})

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    if (!this.password) {
      console.error('❌ User has no password stored')
      return false
    }
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    console.log('🔍 Password comparison result:', isMatch)
    return isMatch
  } catch (error) {
    console.error('❌ Password comparison error:', error)
    return false
  }
}

// Remove password from JSON response
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password
    return ret
  }
})

// Check if model exists before creating
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User