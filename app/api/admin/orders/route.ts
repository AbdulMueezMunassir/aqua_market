import { NextResponse} from 'next/server'

// mock orders data
let orders = [
    {
        id: '#ORD-9082',
        customer: 'Chandimal',
        email: 'chandimal@gmail.com',
        date: '2026-05-21',
        amount: 2500,
        status: 'Processing',
        items: [
            { name: 'Royal Gramma', quantity: 1, price: 8500},
            { name: 'Neon Tetra', quantity: 2, price: 300}
        ],
        shipping: {
            address: 'Wellewatha, Colombo 06',
            city: 'Colombo',
            province: 'Western',
            zip: '12055'
        }
    },
    {
        id: '#ORD-9081',
        customer: 'Jal Paarik',
        email: 'jalpaarik@email.com',
        date: '2026-8-24',
        amount: 8900,
        status: 'Shipped',
        items: [
        { name: 'Crystal Red Shrimp', quantity: 3, price: 1500 },
        { name: 'Halfmoon Betta', quantity: 1, price: 2500 }
        ],
        shipping: {
        address: '18, Molliyamala',
        city: 'Beruwala',
        Province: 'Western',
        zip: '12061'
        }
    },
    {
        id: '#ORD-9079',
        customer: 'Abdullah.M',
        email: 'abdullahm@email.com',
        date: '2026-08-22',
        amount: 5400,
        status: 'Pending',
        items: [
        { name: 'Neon Tetra', quantity: 8, price: 300 },
        { name: 'Halfmoon Betta', quantity: 1, price: 2500 }
        ],
        shipping: {
        address: '55/A Galbokka',
        city: 'Weligama',
        Province: 'Southern',
        zip: '12095'
        }
    },
    {
        id: '#ORD-9078',
        customer: 'Raafath Ahamed',
        email: 'raafathahmd@email.com',
        date: '2026-07-21',
        amount: 12800,
        status: 'Cancelled',
        items: [
        { name: 'Royal Gramma', quantity: 1, price: 8500 },
        { name: 'Crystal Red Shrimp', quantity: 2, price: 1500 }
        ],
        shipping: {
        address: '65 beach road',
        city: 'Maruthamunaiin',
        province: 'Eastern',
        zip: '123654'
        }
    }
]

export async function GET() {
    return NextResponse.json(orders)
}

export async function PUT(request: Request) {
    const body = await request.json()
    const {id, status }= body

    const index = orders.findIndex(order => order.id === id)
    if (index === -1){
        return NextResponse.json({error: 'Order not found', {status: 404}})
    }

    orders[index] = {
        ...order[index],
        status,
        updateAt: new Date()
    }
    return NextResponse.json(orders[index])
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    const index = orders.findIndex(order => order.id === id)
    if (index === -1){
        return NextResponse.json({error: 'Order not found'}, {status: 404})
    }

    orders.splice(index, 1)
    return NextResponse.json({message: 'Order deleted successfully' })
}