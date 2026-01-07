import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Store, ShoppingBag, Package, Trash2, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  category: string;
  condition: string;
  is_active: boolean;
  created_at: string;
  seller_id: string;
  image_url: string | null;
}

interface SellerProfile {
  display_name: string | null;
}

interface Analytics {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  activeListings: number;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalSellers: 0,
    totalBuyers: 0,
    activeListings: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [sellerProfiles, setSellerProfiles] = useState<Record<string, SellerProfile>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchAllProducts();
  }, []);

  const fetchAnalytics = async () => {
    // Get total users from profiles
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get sellers count from user_roles
    const { count: totalSellers } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'seller');

    // Get buyers count from user_roles
    const { count: totalBuyers } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'buyer');

    // Get active listings
    const { count: activeListings } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    setAnalytics({
      totalUsers: totalUsers || 0,
      totalSellers: totalSellers || 0,
      totalBuyers: totalBuyers || 0,
      activeListings: activeListings || 0,
    });
  };

  const fetchAllProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load products');
    } else if (data) {
      setProducts(data);

      // Fetch seller profiles
      const sellerIds = [...new Set(data.map((p) => p.seller_id))];
      if (sellerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', sellerIds);

        if (profiles) {
          const profileMap: Record<string, SellerProfile> = {};
          profiles.forEach((p) => {
            profileMap[p.id] = { display_name: p.display_name };
          });
          setSellerProfiles(profileMap);
        }
      }
    }
    setIsLoading(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      fetchAllProducts();
      fetchAnalytics();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-medium">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sellers</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalSellers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Buyers</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalBuyers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeListings}</div>
            </CardContent>
          </Card>
        </div>

        {/* All Products Table */}
        <div className="mb-4">
          <h2 className="text-xl font-medium mb-4">All Listings</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No listings yet</h3>
              <p className="text-muted-foreground">No products have been listed on the platform</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium truncate max-w-[200px]">{product.title}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {sellerProfiles[product.seller_id]?.display_name || 'Unknown'}
                    </TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(product.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-destructive" />
                              Delete Listing
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.title}"? This action cannot be undone and will remove the listing from buyer views.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </Layout>
  );
}
