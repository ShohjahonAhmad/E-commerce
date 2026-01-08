export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'clothing' | 'shoes' | 'bags' | 'accessories';
  size?: string;
  condition: 'new' | 'like-new' | 'good' | 'fair';
  description: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
}

export type Category = 'all' | 'clothing' | 'shoes' | 'bags' | 'accessories';
export type Condition = 'all' | 'new' | 'like-new' | 'good' | 'fair';
export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popular';
