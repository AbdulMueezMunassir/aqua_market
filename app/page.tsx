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
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/95 via-surface/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface/30" />
        </div>
        
        <div className="relative z-10 w-full max-w-container-max mx-auto px-8 md:px-16 flex flex-col items-start justify-center h-full">
          <div className="glass-panel p-8 md:p-12 rounded-[32px] max-w-2xl transform transition-transform hover:scale-[1.01] duration-500">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm border border-primary/20 backdrop-blur-sm">
                🌿 Premium Selection
              </span>
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary font-label-sm text-label-sm border border-secondary/20 backdrop-blur-sm">
                🐠 Healthy Fish
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4 leading-tight">
              Discover Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Aquarium Favorite
              </span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl leading-relaxed">
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

      {/* Featured Products Section */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Featured Products
            </h2>
            <p className="text-on-surface-variant text-sm mt-1">
              Handpicked premium aquatic species for your aquarium
            </p>
          </div>
          <Link href="/shop" className="text-primary hover:underline font-label-sm flex items-center gap-1">
            View All 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
        <ProductGrid />
      </section>
    </>
  )
}