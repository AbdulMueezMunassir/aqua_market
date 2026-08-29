import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

const categories = [
  {
    name: 'Freshwater Fish',
    description: 'Colorful and diverse species for your aquarium',
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop',
    count: 45
  },
  {
    name: 'Saltwater Fish',
    description: 'Exotic marine species for advanced aquarists',
    image: 'https://images.unsplash.com/photo-1570623375749-bf5f236ab057?w=400&h=300&fit=crop',
    count: 32
  },
  {
    name: 'Aquatic Plants',
    description: 'Beautiful plants to create a natural habitat',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    count: 28
  },
  {
    name: 'Invertebrates',
    description: 'Shrimp, snails, and more for your tank',
    image: 'https://images.unsplash.com/photo-1560439514-6b0d07c2ac1d?w=400&h=300&fit=crop',
    count: 19
  },
  {
    name: 'Aquarium Equipment',
    description: 'Premium filters, lights, and accessories',
    image: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=400&h=300&fit=crop',
    count: 56
  },
  {
    name: 'Aquascaping',
    description: 'Hardscape materials and decorative elements',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    count: 23
  }
]

export default function CategoriesPage() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
      <div className="mb-12">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">
          Explore Categories
        </h1>
        <p className="text-on-surface-variant font-body-lg text-body-lg">
          Discover premium aquatic life and equipment for your aquarium
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/shop?category=${category.name.toLowerCase().replace(' ', '-')}`}
            className="group relative overflow-hidden rounded-2xl h-64 glass-panel hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('${category.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-headline-md text-headline-md">{category.name}</h3>
                <Badge variant="primary" className="bg-white/20 text-white border-white/20">
                  {category.count}
                </Badge>
              </div>
              <p className="text-sm opacity-90">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}