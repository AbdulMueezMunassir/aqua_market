import Link from 'next/link'
import { ProductGrid } from '@/components/marketplace/ProductGrid'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop pt-8 pb-16 flex items-center justify-center">
        <div className="absolute inset-x-margin-mobile md:inset-x-margin-desktop top-8 bottom-16 rounded-[40px] overflow-hidden shadow-2xl shadow-primary/10">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1583484963887-cfe071bdd13c?w=1600&h=900&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/60 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-container-max mx-auto px-8 md:px-16 flex flex-col items-start justify-center h-full">
          <div className="glass-panel p-8 md:p-12 rounded-[32px] max-w-2xl">
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4 leading-tight">
              Discover Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Aquarium Favorite
              </span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
              Healthy aquarium fish, carefully selected for your tank.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop" className="btn-primary">
                Shop Fish
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
          <Link href="/shop" className="text-primary hover:underline">View All →</Link>
        </div>
        <ProductGrid />
      </section>
    </>
  )
}