const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb://localhost:27017/aqua_market'

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  scientificName: String,
  category: String,
  price: Number,
  stock: Number,
  status: String,
  image: String,
  description: String,
  temperature: String,
  pH: String,
  tankSize: String,
  maxSize: String,
  diet: String,
  temperament: String,
  rating: Number,
  reviews: Number,
  createdAt: { type: Date, default: Date.now },
})

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

const products = [
  {
    name: 'Royal Gramma',
    scientificName: 'Gramma loreto',
    category: 'Saltwater',
    price: 8500,
    stock: 12,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi-KAP1Sgn6y9gJ9IFHqEctE8RSfZDOs7ohgAK17s6BoCmxE9LQx2g3YcP-Yx178UWoDaQ0YQaFQ12mnD5mwFgRPG3P2C5zPNDncuPxxRhsMjSF1TfAORfirhuB70CoT1X3mEk7l8LNabRq0JEpoXpQmHfE36cx7J5IKmR4At2TQGvQlzOFnx7hkaUVGFSyUQMpgX1vjaJUnJQNlhGKVI6vR1g6JrO2Zp-1qCZMlRapVTqGLLvEEDL',
    description: 'A stunning saltwater fish with vibrant purple and yellow coloration.',
    temperature: '72-78°F',
    pH: '8.1-8.4',
    tankSize: '30',
    maxSize: '3',
    diet: 'Omnivore',
    temperament: 'Peaceful',
    rating: 4.8,
    reviews: 45,
  },
  {
    name: 'Neon Tetra',
    scientificName: 'Paracheirodon innesi',
    category: 'Freshwater',
    price: 300,
    stock: 145,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoNmUTUWEZP8we5zVp40lgs7jWF62Y1iSA2DEpRIcwvzpqru3V-_9qOECdh-pOpt6b9xtgmfSedfdQwd_dn1e1wTUTzs8JwpTOEKDXlgG4Vs914u-_dGj2NwPgXnkHziTeRTsPunNNxATbiGCy7FswaVtxvYR09a1POrmhQyPaYPp-m3BVM_5FrCNnXAK1psgrFfGNlYU6-DnNFtedr5uSbps8aZ2bR7QYnHNZFyjd3XWClLcneCCw',
    description: 'A classic schooling fish with brilliant neon blue and red stripes.',
    temperature: '70-81°F',
    pH: '6.0-7.0',
    tankSize: '10',
    maxSize: '1.5',
    diet: 'Omnivore',
    temperament: 'Peaceful',
    rating: 4.9,
    reviews: 124,
  },
  {
    name: 'Crystal Red Shrimp',
    scientificName: 'Caridina cantonensis',
    category: 'Invertebrates',
    price: 1500,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZFCPFsaZ7bD0V9TyZBdByH0UKeej5WDt1Rv7JREWu0G-kjMlFYhFgzrpOJuwd2ZtBB0V0AVS7Shcbml0BW-y20zNwNQByoN0MIs8YcjtKu28wg6TFy8X15OKLuGWKhj6LrH7Gjks3-YgYrscPW1Zwxkag3HXGRHA2wTEH9A18WEN73b1pY9Vvz47iixroC-ZfIdcaa3CArEv1ljJ9giaz7WTaKc-wkc7-QZVeoIiBXwObFgT6uGkp',
    description: 'A beautiful freshwater shrimp with striking red and white patterns.',
    temperature: '68-74°F',
    pH: '6.2-7.2',
    tankSize: '5',
    maxSize: '1.2',
    diet: 'Omnivore',
    temperament: 'Peaceful',
    rating: 4.7,
    reviews: 38,
  },
  {
    name: 'Halfmoon Betta',
    scientificName: 'Betta splendens',
    category: 'Freshwater',
    price: 2500,
    stock: 3,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-oawayu2wCKx3u3KuKv8mJutMAfRj6KJat7GiiN2hNjgoFEKehAf3cCzwymJ5Ai1L-u4bsYzH5bYaQEFRfYdhG9D88WjitFXuxPZ-hwLGdgnFyPibZZEaxdh4R66XwmseOwZ819lel7Q4cPfghCaVQZ_lgY9Y14z3-7tkgJdtrWVBwGOvRDuMFQA3uRiHg2GYFIxbiwM0PyWIm_AkB3Y_kWiamhTO-CrOvrE5RRTT5Q3NnukAwBsI',
    description: 'A majestic betta with a beautiful halfmoon tail and vibrant coloration.',
    temperature: '76-82°F',
    pH: '6.5-7.5',
    tankSize: '5',
    maxSize: '2.5',
    diet: 'Carnivore',
    temperament: 'Semi-Aggressive',
    rating: 4.6,
    reviews: 67,
  },
  {
    name: 'Dwarf Gourami',
    scientificName: 'Trichogaster lalius',
    category: 'Freshwater',
    price: 1200,
    stock: 18,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf_iQ31_Ymd1Vi7bzqCc31JKpj4HaRizJhJ_BNFR-zBvXN5awpm_NimtAqzp9ZJ0W2rF4JppkvA_CQglMT4yPZGzwDbnZgau5yma4NHrExCIn4B3XTgul56kGT29ygaMt3IJLifsMYdtj6vnk-FNODJg9sWdAM5hohXhUO9OTv4mbK8yFeOkWLqcEvZOyTBEkcB0TNxYQZuUuLsXU4wyS8HvAp1oqMLTSJClIr09YTxvZR7DJLI9nB',
    description: 'A peaceful and colorful gourami perfect for community tanks.',
    temperature: '72-82°F',
    pH: '6.0-7.5',
    tankSize: '20',
    maxSize: '3',
    diet: 'Omnivore',
    temperament: 'Peaceful',
    rating: 4.8,
    reviews: 89,
  },
  {
    name: 'Pearl Gourami',
    scientificName: 'Trichopodus leerii',
    category: 'Freshwater',
    price: 1500,
    stock: 8,
    status: 'Active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANBsWbpXNLogtdMVqSmxopNdn2b2m0Zdse12rhISIudCpW-dB3rr89DNjom4r6O_WS3Vm4oESMbjFOASK5RwJllAu539cmtaAIJmvwwYKHNqP4oT5SEcfYY17JkE48SajDuxXFkNakI_1v06N1LfNp4P6BQhEAMAHHVqUuwYl5Xh3uMjEtG2aubWOtx6yqas--XFjNBkScj7ChvvU2NxTnYAb9AN4e57Lr-pQU6RiFp496SX-Inf3f',
    description: 'A stunning gourami with a pearl-like pattern and peaceful temperament.',
    temperature: '74-82°F',
    pH: '6.5-7.5',
    tankSize: '30',
    maxSize: '4',
    diet: 'Omnivore',
    temperament: 'Peaceful',
    rating: 4.7,
    reviews: 56,
  },
]

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    await Product.deleteMany({})
    console.log('✅ Cleared existing products')

    for (const product of products) {
      await Product.create(product)
      console.log(`✅ Created product: ${product.name}`)
    }

    console.log(`\n✅ ${products.length} products seeded successfully!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

seedProducts()