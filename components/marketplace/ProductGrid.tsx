'use client'

import { ProductCard } from './ProductCard'

const sampleProducts = [
  {
    id: 1,
    name: 'Dwarf Gourami',
    category: 'Gourami',
    price: 1200,
    rating: 4.8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf_iQ31_Ymd1Vi7bzqCc31JKpj4HaRizJhJ_BNFR-zBvXN5awpm_NimtAqzp9ZJ0W2rF4JppkvA_CQglMT4yPZGzwDbnZgau5yma4NHrExCIn4B3XTgul56kGT29ygaMt3IJLifsMYdtj6vnk-FNODJg9sWdAM5hohXhUO9OTv4mbK8yFeOkWLqcEvZOyTBEkcB0TNxYQZuUuLsXU4wyS8HvAp1oqMLTSJClIr09YTxvZR7DJLI9nB',
    temperature: '72-82°F',
    temperament: 'Peaceful',
    inStock: true
  },
  {
    id: 2,
    name: 'Neon Tetra (School of 6)',
    category: 'Tetra',
    price: 1800,
    rating: 4.9,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdigo_xLo_nqqSOkh7Jrh--65-heJgz3GKbuHg7mXlk_RSH7rLtDGlqKWoGNGW0ff2DgoZNw2TcCg_Zxo0b2jXip3s6fvvOFkPIoLZkSgYK9-lByA-Q6ZgsnH9Q9XccQKOrQSgb63QE4m3kCAD05hqIR6GJ5GU-GfcOFkw-S3QC1Bs_Wdt4mV25IFDdxZ-UIsXu5xTnhrk4W_TJDW-wdb5-5Wf4TKUwjdRGkl5uzAMLgaIiMipTbA7',
    temperature: '70-81°F',
    temperament: 'Peaceful',
    inStock: true
  },
  {
    id: 3,
    name: 'Pearl Gourami',
    category: 'Gourami',
    price: 1500,
    rating: 4.7,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANBsWbpXNLogtdMVqSmxopNdn2b2m0Zdse12rhISIudCpW-dB3rr89DNjom4r6O_WS3Vm4oESMbjFOASK5RwJllAu539cmtaAIJmvwwYKHNqP4oT5SEcfYY17JkE48SajDuxXFkNakI_1v06N1LfNp4P6BQhEAMAHHVqUuwYl5Xh3uMjEtG2aubWOtx6yqas--XFjNBkScj7ChvvU2NxTnYAb9AN4e57Lr-pQU6RiFp496SX-Inf3f',
    temperature: '74-82°F',
    temperament: 'Peaceful',
    inStock: true
  },
  {
    id: 4,
    name: 'Honey Gourami',
    category: 'Gourami',
    price: 1200,
    rating: 4.6,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhQEI5Pgp9XsfF_5ULnCU3ptlulRAYCeukAFOqmlo_sSq7dgIaklHQiKMS18IUiUTBxKiXEm-9bKal9dtJeWyiZsiXPpuoYb6yNl9qjFqypVAopzxh8u9cEP0BUOZ5_j-I5F2IAJ1hKwtiAGfuBzS5G0t3scX6qoYO9qfzTkZr7h0io2LxOr_opyyEr_MvzpaezwzsU2HwO9V-A6uFsFwAZYzyy_3vnP4h_PNV3L1eW-mlF6F_YHB4',
    temperature: '72-82°F',
    temperament: 'Peaceful',
    inStock: true
  },
]

export function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {sampleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}