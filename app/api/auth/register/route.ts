import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    console.log('📝 Registration request received')
    
    await connectToDatabase()
    console.log('✅ Database connected')
    
    // Parse request body
    const rawBody = await request.text()
    console.log('📦 Raw request body:', rawBody)
    
    if (!rawBody || rawBody.trim() === '') {
      return NextResponse.json(
        { error: 'Request body is empty' },
        { status: 400 }
      )
    }
    
    let body
    try {
      body = JSON.parse(rawBody)
      console.log('📦 Parsed body:', { ...body, password: '***' })
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e)
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      )
    }

    const { name, email, password } = body

    // Validate
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }

    if (!email || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!password || password.trim() === '') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    console.log('🔍 Checking if user exists:', normalizedEmail)
    
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      console.log('❌ User already exists:', normalizedEmail)
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }
    console.log('✅ User does not exist')

    // Hash password manually (bypass pre-save hook)
    console.log('🔐 Hashing password...')
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log('✅ Password hashed successfully')

    // Create user with hashed password
    console.log('📝 Creating user...')
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword, // Use pre-hashed password
      role: 'customer',
    })
    
    // Save the user
    await user.save()
    console.log('✅ User created successfully:', user.email)

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'User created successfully. Please login.',
        user: userResponse 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('❌ Registration error:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}