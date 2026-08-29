import Link from 'next/link'
import { ProductGrid } from '@/components/marketplace/ProductGrid'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-16 flex items-center justify-center">
        <div className="absolute inset-x-margin-mobile md:inset-x-margin-desktop top-8 bottom-16 rounded-[40px] overflow-hidden shadow-2xl shadow-primary/10">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600&h=800&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/70 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-container-max mx-auto px-8 md:px-16 flex flex-col items-start justify-center h-full">
          <div className="glass-panel p-8 md:p-12 rounded-[32px] max-w-2xl transform transition-transform hover:scale-[1.01] duration-500">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-6 border border-primary/20 backdrop-blur-sm">
              Premium Selection
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6 leading-tight">
              Discover Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Aquarium Favorite
              </span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
              Healthy aquarium fish, carefully selected for your tank. Experience unmatched quality 
              and clarity with our premium livestock.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">
                Shop Fish
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href="/categories" className="btn-glass">
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-headline-md text-headline-md text-on-surface">Featured Products</h2>
          <Link href="/shop" className="text-primary hover:underline font-label-sm">
            View All →
          </Link>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        }>
          <ProductGrid />
        </Suspense>
      </section>
    </>
  )
}