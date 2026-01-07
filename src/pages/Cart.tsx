import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-2xl md:text-3xl font-serif font-medium mb-4">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Discover our curated collection of luxury pre-loved fashion.
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
        <h1 className="text-3xl md:text-4xl font-serif font-medium mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <article
                key={item.product.id}
                className="flex gap-4 md:gap-6 p-4 bg-card rounded-sm shadow-soft animate-fade-in"
              >
                <Link
                  to={`/product/${item.product.id}`}
                  className="flex-shrink-0"
                >
                  <div className="w-24 md:w-32 aspect-[3/4] rounded-sm overflow-hidden bg-secondary">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {item.product.brand}
                      </p>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-medium mb-1 hover:text-accent transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      {item.product.size && (
                        <p className="text-sm text-muted-foreground">
                          Size: {item.product.size}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-input rounded-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-secondary transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-secondary transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-semibold">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-secondary rounded-sm">
              <h2 className="text-lg font-serif font-medium mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{totalPrice >= 200 ? 'Free' : '$15'}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    ${(totalPrice + (totalPrice >= 200 ? 0 : 15)).toLocaleString()}
                  </span>
                </div>
              </div>

              <Link to="/checkout">
                <Button variant="hero" size="xl" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Free shipping on orders over $200
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
