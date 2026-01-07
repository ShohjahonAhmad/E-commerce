import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Shield, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Package,
    title: 'Easy Listing',
    description: 'Create listings in minutes with our simple tools',
  },
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Protected payments and verified buyers',
  },
  {
    icon: TrendingUp,
    title: 'Reach Buyers',
    description: 'Connect with fashion enthusiasts worldwide',
  },
];

export function SellerCTA() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/70 mb-4">
              Become a Seller
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
              Turn Your Closet Into Cash
            </h2>
            <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8">
              Join thousands of sellers on MODĒ. List your pre-loved luxury items and reach fashion-conscious buyers looking for quality pieces.
            </p>
            <Link to="/register">
              <Button variant="heroOutline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Start Selling Today
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="flex gap-4 p-6 bg-primary-foreground/5 rounded-sm animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0">
                  <benefit.icon className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{benefit.title}</h3>
                  <p className="text-sm text-primary-foreground/70">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
