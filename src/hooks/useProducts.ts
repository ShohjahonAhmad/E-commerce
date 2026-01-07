import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

interface DbProduct {
  id: string;
  seller_id: string;
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

interface SellerProfile {
  id: string;
  display_name: string | null;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Failed to load products');
      setIsLoading(false);
      return;
    }

    if (data && data.length > 0) {
      // Fetch seller profiles
      const sellerIds = [...new Set(data.map((p) => p.seller_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', sellerIds);

      const profileMap: Record<string, SellerProfile> = {};
      profiles?.forEach((p) => {
        profileMap[p.id] = p;
      });

      // Transform database products to app Product type
      const transformedProducts: Product[] = data.map((p: DbProduct) => ({
        id: p.id,
        name: p.title,
        brand: p.brand,
        price: p.price,
        originalPrice: p.original_price || undefined,
        image: p.image_url || '/placeholder.svg',
        category: p.category as Product['category'],
        size: p.size || undefined,
        condition: p.condition as Product['condition'],
        description: p.description || '',
        sellerId: p.seller_id,
        sellerName: profileMap[p.seller_id]?.display_name || 'Unknown Seller',
        createdAt: p.created_at,
      }));

      setProducts(transformedProducts);
    } else {
      setProducts([]);
    }

    setIsLoading(false);
  };

  return { products, isLoading, error, refetch: fetchProducts };
}
