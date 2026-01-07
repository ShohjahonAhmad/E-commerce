import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-hero">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="max-w-xl animate-fade-up">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Curated Pre-Loved Luxury
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
              Fashion with a <span className="italic">Second Life</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Discover unique pieces from top designers. Buy and sell authenticated luxury fashion in our peer-to-peer marketplace.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button variant="hero" size="xl">
                  Shop Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/sell">
                <Button variant="heroOutline" size="xl">
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image Grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80"
                  alt="Fashion editorial"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-sm overflow-hidden shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80"
                  alt="Luxury accessories"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square rounded-sm overflow-hidden shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80"
                  alt="Shopping experience"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80"
                  alt="Fashion collection"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
