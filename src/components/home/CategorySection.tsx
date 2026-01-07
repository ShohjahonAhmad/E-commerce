import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Clothing',
    slug: 'clothing',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80',
    count: 248,
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    count: 156,
  },
  {
    name: 'Bags',
    slug: 'bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    count: 89,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
    count: 124,
  },
];

export function CategorySection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore our curated collection of luxury pre-loved fashion pieces
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/shop?category=${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-serif font-medium text-primary-foreground mb-1">
                  {category.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-foreground/80">
                    {category.count} items
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
