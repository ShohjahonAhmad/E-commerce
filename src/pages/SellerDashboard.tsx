import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Package, DollarSign, Eye } from 'lucide-react';
import { z } from 'zod';

const productSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  original_price: z.number().min(0).optional().nullable(),
  category: z.enum(['clothing', 'shoes', 'bags', 'accessories']),
  size: z.string().max(50).optional(),
  brand: z.string().trim().min(1, 'Brand is required').max(100, 'Brand is too long'),
  condition: z.enum(['new', 'like-new', 'good', 'fair']),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  size: string | null;
  brand: string;
  condition: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    original_price: null,
    category: 'clothing',
    size: '',
    brand: '',
    condition: 'new',
  });

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load products');
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      original_price: null,
      category: 'clothing',
      size: '',
      brand: '',
      condition: 'new',
    });
    setImageFile(null);
    setErrors({});
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price,
      original_price: product.original_price,
      category: product.category as ProductFormData['category'],
      size: product.size || '',
      brand: product.brand,
      condition: product.condition as ProductFormData['condition'],
    });
    setIsDialogOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (uploadError) {
      toast.error('Failed to upload image');
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      productSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    if (!user) return;
    setIsSubmitting(true);

    let imageUrl = editingProduct?.image_url || null;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description || null,
          price: formData.price,
          original_price: formData.original_price || null,
          category: formData.category,
          size: formData.size || null,
          brand: formData.brand,
          condition: formData.condition,
          image_url: imageUrl,
        })
        .eq('id', editingProduct.id)
        .eq('seller_id', user.id);

      if (error) {
        toast.error('Failed to update product');
      } else {
        toast.success('Product updated!');
        setIsDialogOpen(false);
        resetForm();
        fetchProducts();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert({
          seller_id: user.id,
          title: formData.title,
          description: formData.description || null,
          price: formData.price,
          original_price: formData.original_price || null,
          category: formData.category,
          size: formData.size || null,
          brand: formData.brand,
          condition: formData.condition,
          image_url: imageUrl,
        });

      if (error) {
        toast.error('Failed to create product');
      } else {
        toast.success('Product created!');
        setIsDialogOpen(false);
        resetForm();
        fetchProducts();
      }
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('seller_id', user?.id);

    if (error) {
      toast.error('Failed to delete product');
    } else {
      toast.success('Product deleted');
      fetchProducts();
    }
  };

  const activeListings = products.filter((p) => p.is_active).length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-medium">My Listings</h1>
            <p className="text-muted-foreground">Manage your product listings</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Listing' : 'Create New Listing'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Product title"
                    />
                    {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Brand name"
                    />
                    {errors.brand && <p className="text-sm text-destructive mt-1">{errors.brand}</p>}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value as ProductFormData['category'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                    {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <Label htmlFor="original_price">Original Price ($)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.original_price || ''}
                      onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || null })}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={formData.size || ''}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="e.g., M, L, 42"
                    />
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value as ProductFormData['condition'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New with tags</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your item..."
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="image">Product Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    {editingProduct?.image_url && !imageFile && (
                      <p className="text-sm text-muted-foreground mt-1">Current image will be kept</p>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingProduct ? 'Update Listing' : 'Create Listing'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeListings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-4">Create your first listing to start selling</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">{product.condition.replace('-', ' ')}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
