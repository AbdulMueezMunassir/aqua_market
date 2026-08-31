import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

export async function POST(request: Request) {
  try {
    console.log('📩 Login request received')
    
    // Connect to database
    await connectToDatabase()

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log('📦 Request body:', { email: body.email, password: '***' })
    } catch (e) {
      console.error('❌ Failed to parse request body:', e)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { email, password } = body

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    console.log('🔍 Looking for user:', email)
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      console.log('❌ User not found:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    console.log('✅ User found:', user.email)

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      console.log('❌ Invalid password for:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    console.log('✅ Password matched')

    // Create JWT token
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

    // Return user without password
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

    const response = {
      success: true,
      user: userData,
      token,
    }
    console.log('📤 Sending response:', { success: true, email: userData.email, role: userData.role })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}