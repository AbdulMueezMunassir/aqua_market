import { NextResponse } from "next/server";

export async function GET() {
    // mock analytic data
    const analytics = {
        totalRevenue: 2459200,
        totalOrders: 1248,
        activeCustomers: 8432,
        lowStockItems: 14,
        reenueByMonth: [
            { month: 'Jan', revenue: 180000},
            { month: 'Feb', revenue: 195000 },
        { month: 'Mar', revenue: 210000 },
        { month: 'Apr', revenue: 225000 },
        { month: 'May', revenue: 240000 },
        { month: 'Jun', revenue: 255000 },
        { month: 'Jul', revenue: 270000 },
        { month: 'Aug', revenue: 285000 },
        { month: 'Sep', revenue: 300000 },
        { month: 'Oct', revenue: 315000 },
        { month: 'Nov', revenue: 330000 },
        { month: 'Dec', revenue: 345000 }
        ],
        topProducts: [
            { name: 'Royal Gramma', sales: 245, revenue: 2082500 },
            { name: 'Neon Tetra', sales: 189, revenue: 56700 },
            { name: 'Crystal Red Shrimp', sales: 156, revenue: 234000 },
            { name: 'Halfmoon Betta', sales: 98, revenue: 245000 }
        ],
        recentOrders: [
            { id: '#ORD-9082', customer: 'Sarah Jenkins', amount: 14550, status: 'Processing', date: '2024-10-24' },
            { id: '#ORD-9081', customer: 'Michael Torres', amount: 8900, status: 'Shipped', date: '2024-10-24' },
            { id: '#ORD-9080', customer: 'David Chen', amount: 31275, status: 'Delivered', date: '2024-10-23' }
        ]
    }

    return NextResponse.json(analytics)
}