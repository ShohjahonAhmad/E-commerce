import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  displayName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['buyer', 'seller']),
});

interface AuthPageProps {
  mode: 'login' | 'register';
}

export default function Auth({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, isLoading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const validateForm = () => {
    setErrors({});
    
    try {
      if (mode === 'login') {
        loginSchema.parse({ email, password });
      } else {
        signupSchema.parse({ email, password, displayName, role });
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
        }
      } else {
        const { error } = await signUp(email, password, displayName, role);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created successfully!');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'login'
                ? 'Sign in to your MODĒ account'
                : 'Join MODĒ and start shopping or selling'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <>
                {/* Account Type */}
                <div>
                  <Label className="mb-3 block">I want to</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`p-4 rounded-sm border text-center transition-all ${
                        role === 'buyer'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input hover:border-primary'
                      }`}
                    >
                      <p className="font-medium text-sm">Shop</p>
                      <p className="text-xs opacity-80 mt-1">Browse & buy items</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className={`p-4 rounded-sm border text-center transition-all ${
                        role === 'seller'
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input hover:border-primary'
                      }`}
                    >
                      <p className="font-medium text-sm">Sell</p>
                      <p className="text-xs opacity-80 mt-1">List & sell items</p>
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1"
                    autoComplete="name"
                  />
                  {errors.displayName && (
                    <p className="text-sm text-destructive mt-1">{errors.displayName}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password">Password</Label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'login' ? '••••••••' : 'Create a password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 pr-10"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
              {mode === 'register' && !errors.password && (
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? mode === 'login'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </Button>

            {mode === 'register' && (
              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            )}
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-foreground font-medium hover:text-accent transition-colors"
                >
                  Create one
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-foreground font-medium hover:text-accent transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </Layout>
  );
}
