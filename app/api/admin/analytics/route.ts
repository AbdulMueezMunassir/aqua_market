import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Order from '@/models/Order'
import Product from '@/models/Product'
import User from '@/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key'

// ────────────────────────────────────────────────────────────
// Admin role check
// ────────────────────────────────────────────────────────────
function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.role !== 'admin') return null
    return decoded
  } catch {
    return null
  }
}

// ────────────────────────────────────────────────────────────
// GET — real analytics from MongoDB
// ────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    // 🔒 Admin only
    const admin = verifyAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      )
    }

    await connectToDatabase()

    // ── 1. Total revenue (all paid + pending orders)
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } },
    ])
    const totalRevenue = revenueAgg[0]?.total || 0

    // ── 2. Total orders
    const totalOrders = await Order.countDocuments()

    // ── 3. Active customers
    const activeCustomers = await User.countDocuments({ role: 'customer' })

    // ── 4. Low stock items (< 5 in stock)
    const lowStockItems = await Product.countDocuments({ stock: { $lt: 5 } })

    // ── 5. Revenue by month (last 12 months)
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)

    const monthlyAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$total' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ])

    // Build 12-month skeleton with zeros
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ]
    const revenueByMonth: Array<{ month: string; revenue: number }> = []
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
      const match = monthlyAgg.find(
        (m) => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1
      )
      revenueByMonth.push({
        month: monthNames[d.getMonth()],
        revenue: match?.revenue || 0,
      })
    }

    // ── 6. Top products (by revenue, from all orders)
    const topProductsAgg = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          sales: { $sum: '$items.quantity' },
          revenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] },
          },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          name: '$_id',
          sales: 1,
          revenue: 1,
        },
      },
    ])

    // ── 7. Recent orders (latest 5)
    const recentOrdersRaw = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()

    const recentOrders = recentOrdersRaw.map((o: any) => ({
      id: `#${o.orderId}`,
      customer: o.customer,
      amount: o.total,
      status: o.status,
      date: o.createdAt,
    }))

    // ── Response
    const analytics = {
      totalRevenue,
      totalOrders,
      activeCustomers,
      lowStockItems,
      revenueByMonth,
      topProducts: topProductsAgg,
      recentOrders,
    }

    return NextResponse.json(analytics)
  } catch (error: any) {
    console.error('❌ Analytics error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}