import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, profile, signOut } = useAuth();
  const { isSeller, isAdmin } = useUserRoles();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-serif font-semibold tracking-tight">
              MODĒ
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Shop All
            </Link>
            <Link to="/shop?category=clothing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Clothing
            </Link>
            <Link to="/shop?category=shoes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Shoes
            </Link>
            <Link to="/shop?category=bags" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Bags
            </Link>
            <Link to="/shop?category=accessories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Accessories
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs bg-secondary">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">
                      {profile?.display_name || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {profile?.role || 'Member'}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  {isSeller() && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        Seller Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin() && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-medium flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/shop"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop All
              </Link>
              <Link
                to="/shop?category=clothing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Clothing
              </Link>
              <Link
                to="/shop?category=shoes"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shoes
              </Link>
              <Link
                to="/shop?category=bags"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Bags
              </Link>
              <Link
                to="/shop?category=accessories"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accessories
              </Link>
              {user && isSeller() && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Seller Dashboard
                </Link>
              )}
              {user && isAdmin() && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
