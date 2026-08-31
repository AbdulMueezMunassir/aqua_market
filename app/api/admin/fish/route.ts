import { NextResponse } from "next/server";

// mock data - in production,this would come from database
let fishInventory = [
    {
        id : 1,
        name: 'Royal Gramma',
        scientificName: ''Gramma loreto',
        category: 'Saltwater',
        price: 8500,
        stock: 12,
        status: 'Active'
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi-KAP1Sgn6y9gJ9IFHqEctE8RSfZDOs7ohgAK17s6BoCmxE9LQx2g3YcP-Yx178UWoDaQ0YQaFQ12mnD5mwFgRPG3P2C5zPNDncuPxxRhsMjSF1TfAORfirhuB70CoT1X3mEk7l8LNabRq0JEpoXpQmHfE36cx7J5IKmR4At2TQGvQlzOFnx7hkaUVGFSyUQMpgX1vjaJUnJQNlhGKVI6vR1g6JrO2Zp-1qCZMlRapVTqGLLvEEDL',
        createdAt: new Date('2026-08-25'),
        udatedAt: new Date('2026-08-27')
    },
    {
        id : 2,
        name: 'Neon Tetra',
        scientificName: 'Paracheirodon innesi',
        category: 'Freshwater',
        price: 200,
        stock: 125,
        status: 'Active'
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoNmUTUWEZP8we5zVp40lgs7jWF62Y1iSA2DEpRIcwvzpqru3V-_9qOECdh-pOpt6b9xtgmfSedfdQwd_dn1e1wTUTzs8JwpTOEKDXlgG4Vs914u-_dGj2NwPgXnkHziTeRTsPunNNxATbiGCy7FswaVtxvYR09a1POrmhQyPaYPp-m3BVM_5FrCNnXAK1psgrFfGNlYU6-DnNFtedr5uSbps8aZ2bR7QYnHNZFyjd3XWClLcneCCw',
        createdAt: new Date('2026-08-25'),
        udatedAt: new Date('2026-08-27')
    },
    {
       id: 3,
    name: 'Crystal Red Shrimp',
    scientificName: 'Caridina cantonensis',
    category: 'Invertebrates',
    price: 1500,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZFCPFsaZ7bD0V9TyZBdByH0UKeej5WDt1Rv7JREWu0G-kjMlFYhFgzrpOJuwd2ZtBB0V0AVS7Shcbml0BW-y20zNwNQByoN0MIs8YcjtKu28wg6TFy8X15OKLuGWKhj6LrH7Gjks3-YgYrscPW1Zwxkag3HXGRHA2wTEH9A18WEN73b1pY9Vvz47iixroC-ZfIdcaa3CArEv1ljJ9giaz7WTaKc-wkc7-QZVeoIiBXwObFgT6uGkp',
    createdAt: new Date('2024-10-03'),
    updatedAt: new Date('2024-10-03') 
    },
    {
        id: 4,
    name: 'Halfmoon Betta',
    scientificName: 'Betta splendens',
    category: 'Freshwater',
    price: 2500,
    stock: 3,
    status: 'Inactive',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-oawayu2wCKx3u3KuKv8mJutMAfRj6KJat7GiiN2hNjgoFEKehAf3cCzwymJ5Ai1L-u4bsYzH5bYaQEFRfYdhG9D88WjitFXuxPZ-hwLGdgnFyPibZZEaxdh4R66XwmseOwZ819lel7Q4cPfghCaVQZ_lgY9Y14z3-7tkgJdtrWVBwGOvRDuMFQA3uRiHg2GYFIxbiwM0PyWIm_AkB3Y_kWiamhTO-CrOvrE5RRTT5Q3NnukAwBsI',
    createdAt: new Date('2024-10-04'),
    updatedAt: new Date('2024-10-04')
    }
]

export async function GET() {
    return NextResponse.json(fishInventory)
}

export async function POST(request: Request) {
    const body = await request.json()
    const newFish = {
        id: Date.now(),
        ...body,
        createAt: new Date(),
        updateAt: new Date()
    }
    fishInventory.push(newFish)
    return NextResponse.json(newFish, {status: 201})
}

export async function PUT(request: Request) {
    const body = await request.json()
    const { id, ...updates } = body
    const index = fishInventory.findIndex(fish => fish.id == id)

    if (index === -1){
        return NextResponse.json({error: 'Fish not found'}, {status: 404 });
        
    }

    fishInventory[index] = {
        ...fishInventory[index],
        ...updates,
        updateAt: new Date()
    }

    return NextResponse.json(fishInventory[index])
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    const index = fishInventory.findIndex(fish => fish.id === id)
    if(index === -1 ){
        return NextResponse.json({error: 'Fish Not Found'}, {status: 404})
    }

    fishInventory.splice(index, 1)
    return NextResponse.json({message: 'Fish deleted successfully'})
}