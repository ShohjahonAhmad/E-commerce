import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { mockProducts } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Heart, Share2, ChevronRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { ProductGrid } from '@/components/products/ProductGrid';

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif mb-4">Product not found</h1>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart', {
      description: product.name,
    });
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-foreground transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate max-w-[150px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="animate-fade-in">
            <div className="aspect-[3/4] rounded-sm overflow-hidden bg-secondary">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="animate-fade-up lg:py-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 text-xs font-medium bg-secondary rounded-sm capitalize">
                {product.condition === 'like-new' ? 'Like New' : product.condition}
              </span>
              {discount && (
                <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-sm">
                  -{discount}% OFF
                </span>
              )}
            </div>

            <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
              {product.brand}
            </p>
            <h1 className="text-2xl md:text-3xl font-serif font-medium mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-semibold">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {product.size && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Size</p>
                <div className="inline-flex items-center justify-center px-4 py-2 border border-input rounded-sm text-sm">
                  {product.size}
                </div>
              </div>
            )}

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button
                variant="hero"
                size="xl"
                className="flex-1"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-14 w-14">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="border-t border-border pt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>Authenticity Guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span>Free Shipping on orders over $200</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <span>Easy Returns within 14 days</span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border-t border-border mt-8 pt-8">
              <p className="text-sm text-muted-foreground mb-1">Sold by</p>
              <p className="font-medium">{product.sellerName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-16 border-t border-border">
          <ProductGrid products={relatedProducts} title="You May Also Like" />
        </div>
      )}
    </Layout>
  );
}
