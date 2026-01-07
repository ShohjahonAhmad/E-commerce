import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (items.length === 0 && !isComplete) {
    navigate('/cart');
    return null;
  }

  const shippingCost = totalPrice >= 200 ? 0 : 15;
  const orderTotal = totalPrice + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      clearCart();
      toast.success('Order placed successfully!');
    }, 1500);
  };

  if (isComplete) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="max-w-md mx-auto animate-fade-up">
            <CheckCircle className="h-16 w-16 mx-auto text-accent mb-6" />
            <h1 className="text-2xl md:text-3xl font-serif font-medium mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your order has been confirmed. We'll send you an email with order details and tracking information.
            </p>
            <Link to="/shop">
              <Button variant="hero" size="xl">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-serif font-medium mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact */}
            <section>
              <h2 className="text-lg font-serif font-medium mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="text-lg font-serif font-medium mb-4">
                Shipping Address
              </h2>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    required
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="ZIP"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Notice */}
            <section className="p-4 bg-secondary rounded-sm">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Demo Mode:</strong> This is a demonstration checkout. No real payment will be processed.
              </p>
            </section>

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Place Order - $${orderTotal.toLocaleString()}`}
            </Button>
          </form>

          {/* Order Summary */}
          <div className="lg:order-first lg:order-last">
            <div className="sticky top-24 p-6 bg-secondary rounded-sm">
              <h2 className="text-lg font-serif font-medium mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4"
                  >
                    <div className="w-16 aspect-[3/4] rounded-sm overflow-hidden bg-card">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${orderTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
