const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MONGODB_URI = 'mongodb://localhost:27017/aqua_market'

// Simple schema without pre-hooks
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
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
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    await User.deleteMany({})
    console.log('✅ Cleared existing users')

    // Hash passwords manually
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(userData.password, salt)
      
      const user = new User({
        ...userData,
        password: hashedPassword,
      })
      await user.save()
      console.log(`✅ Created user: ${userData.email} (${userData.role})`)
    }

    console.log('\n✅ Database seeded successfully!')
    console.log('\n📝 Demo Accounts:')
    console.log('Admin: admin@aquamarket.com / admin123')
    console.log('Staff: staff@aquamarket.com / staff123')
    console.log('Customer: customer@aquamarket.com / customer123')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

seed()