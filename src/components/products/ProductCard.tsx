import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <article className="group animate-fade-up">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-sm mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to wishlist
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>

          {/* Condition badge */}
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 text-xs font-medium bg-background/90 backdrop-blur-sm rounded-sm capitalize">
              {product.condition === "like-new"
                ? "Like New"
                : product.condition}
            </span>
          </div>

          {/* Discount badge */}
          {discount && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-sm">
                -{discount}%
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.brand}
          </p>
          <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
