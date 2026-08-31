const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = 'mongodb://localhost:27017/aqua_market'

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zipCode: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Hash password before saving - FIXED version
UserSchema.pre('save', async function(next) {
  // Make sure we have a password to hash
  if (!this.isModified('password')) {
    return next()
  }
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)

const users = [
  {
    name: 'Admin User',
    email: 'admin@aquamarket.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Staff User',
    email: 'staff@aquamarket.com',
    password: 'staff123',
    role: 'staff',
  },
  {
    name: 'Customer User',
    email: 'customer@aquamarket.com',
    password: 'customer123',
    role: 'customer',
  },
]

async function seed() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Connected to MongoDB')

    // Clear existing users
    await User.deleteMany({})
    console.log('✅ Cleared existing users')

    // Create users
    for (const userData of users) {
      const user = new User(userData)
      await user.save()
      console.log(`✅ Created user: ${userData.email} (${userData.role})`)
    }

    console.log('\n✅ Database seeded successfully!')
    console.log('\n📝 Demo Accounts:')
    console.log('┌─────────────┬─────────────────────────┬──────────────┐')
    console.log('│ Role        │ Email                   │ Password     │')
    console.log('├─────────────┼─────────────────────────┼──────────────┤')
    console.log('│ Admin       │ admin@aquamarket.com    │ admin123     │')
    console.log('│ Staff       │ staff@aquamarket.com    │ staff123     │')
    console.log('│ Customer    │ customer@aquamarket.com │ customer123  │')
    console.log('└─────────────┴─────────────────────────┴──────────────┘')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()