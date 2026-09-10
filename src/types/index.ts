export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  image?: string;
  itemCount?: number;
  highlightColor?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  details?: string[];
  inStock: boolean;
  stockCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export interface OrderCustomer {
  fullName: string;
  phoneNumber: string;
  alternativePhone?: string;
  deliveryAddress: string;
  districtArea: string; // 'inside_dhaka' | 'suburbs_dhaka' | 'outside_dhaka'
  note?: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'bKash / Mobile Wallet';
  status: OrderStatus;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  link: string;
  image: string;
  bgGradient?: string;
}

export interface FilterState {
  categoryId?: string;
  subcategoryId?: string;
  minPrice: number;
  maxPrice: number;
  sizes: string[];
  colors: string[];
  sortBy: 'latest' | 'price-low' | 'price-high' | 'popular';
  searchQuery: string;
}
