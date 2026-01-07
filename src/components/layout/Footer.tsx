import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-serif font-semibold tracking-tight mb-4">
              MODĒ
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A curated marketplace for pre-loved luxury fashion. Buy and sell
              with confidence.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop?category=clothing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=shoes"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shoes
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=bags"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bags
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=accessories"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  to="/sell"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sell With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Help
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-muted-foreground">
                  Shipping Info
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Returns</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">FAQ</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Contact Us
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © 2026 MODĒ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
