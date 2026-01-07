import { Link } from 'react-router-dom';
import { mockProducts } from '@/data/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FeaturedSection() {
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
              New Arrivals
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-medium">
              Just In
            </h2>
          </div>
          <Link to="/shop" className="mt-4 md:mt-0">
            <Button variant="minimal" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
}
