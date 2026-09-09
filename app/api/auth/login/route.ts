import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

export async function POST(request: Request) {
  try {
    console.log('📩 Login request received')
    
    await connectToDatabase()
    console.log('✅ Database connected')

    let body
    try {
      body = await request.json()
      console.log('📦 Login request for:', body?.email)
    } catch (e) {
      console.error('❌ Failed to parse request body:', e)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user with password
    console.log('🔍 Looking for user:', email)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    
    if (!user) {
      console.log('❌ User not found:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    console.log('✅ User found:', user.email)

    // Check if user has a password
    if (!user.password) {
      console.log('❌ User has no password stored')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Compare password directly with bcrypt
    console.log('🔍 Comparing password for:', user.email)
    const isMatch = await bcrypt.compare(password, user.password)
    console.log('  - Password match result:', isMatch)
    
    if (!isMatch) {
      console.log('❌ Invalid password for:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    console.log('✅ Password matched')

    // Generate token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    console.log('✅ JWT token created')

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zipCode || '',
    }

    console.log('📤 Login successful for:', user.email)
    return NextResponse.json({
      success: true,
      user: userData,
      token,
    })
    
  } catch (error: any) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}