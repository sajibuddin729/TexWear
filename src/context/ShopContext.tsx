'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, OrderCustomer, Banner } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNERS, INITIAL_ORDERS, INITIAL_SETTINGS, INITIAL_STORES, SiteSettingsData, StoreLocationData } from '@/data/initialData';
import toast from 'react-hot-toast';

interface ShopContextType {
  products: Product[];
  productsLoaded: boolean;
  categories: Category[];
  categoriesLoaded: boolean;
  banners: Banner[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  siteSettings: SiteSettingsData;
  storeLocations: StoreLocationData[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickOrderProduct: Product | null;
  setQuickOrderProduct: (product: Product | null) => void;

  // Cart Actions
  addToCart: (product: Product, selectedSize?: string, selectedColor?: { name: string; hex: string }, qty?: number) => void;
  removeFromCart: (productId: string, size: string, colorName: string) => void;
  updateCartQty: (productId: string, size: string, colorName: string, delta: number) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartCount: () => number;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout & Order Actions
  placeOrder: (customer: OrderCustomer, paymentMethod: 'Cash on Delivery' | 'bKash / Mobile Wallet', customCart?: CartItem[]) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Admin Mutations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<boolean>;
  updateProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleFlashSale: (productId: string, isFlashSale: boolean) => Promise<boolean>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<boolean>;
  updateCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateSiteSettings: (settings: Partial<SiteSettingsData>) => Promise<void>;
  addStoreLocation: (store: Omit<StoreLocationData, 'id'>) => Promise<void>;
  updateStoreLocation: (store: StoreLocationData) => Promise<void>;
  deleteStoreLocation: (id: string) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CART = 'texwear_cart_v2';
const LOCAL_STORAGE_KEY_WISHLIST = 'texwear_wishlist_v2';

// Safe localStorage helper to prevent QuotaExceededError crashes
const safeSetLocalStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`[ShopContext] Quota exceeded for localStorage key "${key}". Cleaning up heavy caches...`, error);
    try {
      // Clear non-essential large legacy caches (categories, orders, products)
      localStorage.removeItem('texwear_categories_v3');
      localStorage.removeItem('texwear_orders_v2');
      localStorage.removeItem('texwear_categories');
      localStorage.removeItem('texwear_orders');
      localStorage.removeItem('texwear_products');
      localStorage.setItem(key, value);
    } catch (retryError) {
      console.warn(`[ShopContext] Could not persist "${key}" to localStorage even after cleanup:`, retryError);
    }
  }
};

// Slim down cart items to store only essential data in localStorage
const serializeCart = (cartItems: CartItem[]) => {
  return cartItems.map((item) => ({
    product: {
      id: item.product.id,
      title: item.product.title,
      slug: item.product.slug,
      sku: item.product.sku,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      images: item.product.images?.length > 0 ? [item.product.images[0]] : [],
      categoryName: item.product.categoryName,
      categoryId: item.product.categoryId,
    },
    selectedSize: item.selectedSize,
    selectedColor: item.selectedColor,
    quantity: item.quantity,
  }));
};

// Safe JSON parser to handle 413 Request Entity Too Large or non-JSON server errors gracefully
async function safeParseJson(res: Response, fallbackError = 'Request failed') {
  const text = await res.text();
  if (!res.ok) {
    if (res.status === 413 || text.includes('Request Entity Too Large') || text.includes('Request En')) {
      throw new Error('Image or data size is too large (413 Request Entity Too Large). Please upload a smaller image.');
    }
    try {
      const err = JSON.parse(text);
      throw new Error(err.error || err.message || `Server error (${res.status})`);
    } catch {
      throw new Error(text.slice(0, 150) || fallbackError);
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    if (text.includes('Request Entity Too Large') || text.includes('Request En')) {
      throw new Error('Image or data size is too large (413 Request Entity Too Large).');
    }
    throw new Error('Server returned an invalid JSON response');
  }
}

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [banners] = useState<Banner[]>(INITIAL_BANNERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>(INITIAL_SETTINGS);
  const [storeLocations, setStoreLocations] = useState<StoreLocationData[]>(INITIAL_STORES);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  // Track whether the API categories and products have been loaded (to suppress flash)
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Load data from API / LocalStorage on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Fetch all APIs in parallel with cache: 'no-store' for fresh database data
        const [catRes, prodRes, orderRes, settingsRes, storesRes] = await Promise.allSettled([
          fetch('/api/categories', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/products', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/orders', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/settings', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/stores', { cache: 'no-store' }).then((r) => r.json()),
        ]);

        if (catRes.status === 'fulfilled' && catRes.value?.success && Array.isArray(catRes.value.data)) {
          setCategories(catRes.value.data);
        }
        // Mark categories as loaded regardless (API responded)
        setCategoriesLoaded(true);

        if (prodRes.status === 'fulfilled' && prodRes.value?.success && Array.isArray(prodRes.value.data)) {
          setProducts(prodRes.value.data);
        }
        // Mark products as loaded (API responded)
        setProductsLoaded(true);

        if (orderRes.status === 'fulfilled' && orderRes.value?.success && Array.isArray(orderRes.value.data)) {
          const mappedOrders: Order[] = orderRes.value.data.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderId,
            customer: {
              fullName: o.customerName,
              phoneNumber: o.customerPhone,
              alternativePhone: o.customerEmail || '',
              deliveryAddress: o.customerAddress,
              districtArea: o.customerCity,
              note: o.customerNotes || '',
            },
            items: o.items.map((i: any) => ({
              product: {
                id: i.productId,
                title: i.title,
                price: i.price,
                images: [i.image || '/final_logo6.png'],
              } as Product,
              selectedSize: i.size || 'Standard',
              selectedColor: { name: i.colorName || 'Default', hex: '#000' },
              quantity: i.quantity,
            })),
            subtotal: o.subtotal,
            shippingFee: o.shippingFee,
            discount: o.discount || 0,
            totalAmount: o.totalAmount,
            paymentMethod: o.paymentMethod,
            status: o.status,
            createdAt: o.createdAt,
          }));
          setOrders(mappedOrders);
        }

        if (settingsRes.status === 'fulfilled' && settingsRes.value?.success && settingsRes.value.settings) {
          setSiteSettings(settingsRes.value.settings);
        }

        if (storesRes.status === 'fulfilled' && storesRes.value?.success && Array.isArray(storesRes.value.stores)) {
          setStoreLocations(storesRes.value.stores);
        }

        // Clean up any heavy legacy caches from previous versions to free up quota
        try {
          localStorage.removeItem('texwear_categories_v3');
          localStorage.removeItem('texwear_orders_v2');
          localStorage.removeItem('texwear_categories');
          localStorage.removeItem('texwear_orders');
          localStorage.removeItem('texwear_products');
        } catch (_) {}

        const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY_CART);
        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed)) setCart(parsed);
          } catch (e) {
            console.error('Error parsing cart from localStorage', e);
          }
        }

        const savedWishlist = localStorage.getItem(LOCAL_STORAGE_KEY_WISHLIST);
        if (savedWishlist) {
          try {
            const parsed = JSON.parse(savedWishlist);
            if (Array.isArray(parsed)) setWishlist(parsed);
          } catch (e) {
            console.error('Error parsing wishlist from localStorage', e);
          }
        }
      } catch (e) {
        console.error('Error loading data from API', e);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    safeSetLocalStorage(LOCAL_STORAGE_KEY_CART, JSON.stringify(serializeCart(cart)));
  }, [cart]);

  useEffect(() => {
    safeSetLocalStorage(LOCAL_STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart Handlers
  const addToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: { name: string; hex: string },
    qty = 1
  ) => {
    const size = selectedSize || (product.sizes?.length > 0 ? product.sizes[0] : 'Standard');
    const color = selectedColor || (product.colors?.length > 0 ? product.colors[0] : { name: 'Default', hex: '#000000' });

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prev, { product, selectedSize: size, selectedColor: color, quantity: qty }];
      }
    });

    toast.success(`${product.title.slice(0, 30)}... added to Cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string, colorName: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          )
      )
    );
    toast.error('Item removed from cart');
  };

  const updateCartQty = (productId: string, size: string, colorName: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.name === colorName
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Wishlist Handlers
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        toast('Removed from Wishlist', { icon: '💔' });
        return prev.filter((id) => id !== productId);
      } else {
        toast('Saved to Wishlist!', { icon: '❤️' });
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Helper function to upload base64 images safely via binary FormData
  const uploadImageIfNeeded = async (img: string): Promise<string> => {
    if (img.startsWith('data:image/')) {
      try {
        const blobRes = await fetch(img);
        const blob = await blobRes.blob();
        const formData = new FormData();
        formData.append('file', blob, 'image.jpg');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await safeParseJson(res, 'Failed to parse image upload response');
          if (data.success && data.url) return data.url;
        } else {
          console.warn('Image upload endpoint returned status:', res.status);
        }
      } catch (e) {
        console.error('Image upload failed:', e);
      }
    }
    return img;
  };

  // Orders & Guest Checkout
  const placeOrder = (
    customer: OrderCustomer,
    paymentMethod: 'Cash on Delivery' | 'bKash / Mobile Wallet',
    customCart?: CartItem[]
  ): Order => {
    const itemsToOrder = customCart || cart;
    const subtotal = itemsToOrder.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    let shippingFee = 70;
    if (customer.districtArea === 'suburbs_dhaka') shippingFee = 100;
    if (customer.districtArea === 'outside_dhaka') shippingFee = 130;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `TW-${Math.floor(100000 + Math.random() * 900000)}`,
      customer,
      items: itemsToOrder,
      subtotal,
      shippingFee,
      discount: 0,
      totalAmount: subtotal + shippingFee,
      paymentMethod,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // Save to API
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: customer.fullName,
        customerPhone: customer.phoneNumber,
        customerEmail: customer.alternativePhone,
        customerAddress: customer.deliveryAddress,
        customerCity: customer.districtArea,
        customerNotes: customer.note,
        paymentMethod,
        subtotal,
        shippingFee,
        discount: 0,
        totalAmount: subtotal + shippingFee,
        items: itemsToOrder.map((item) => ({
          productId: item.product.id,
          title: item.product.title,
          price: item.product.price,
          qty: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.product.images[0],
        })),
      }),
    }).catch((err) => console.error('Failed to post order to API:', err));

    setOrders((prev) => [newOrder, ...prev]);
    if (!customCart) clearCart();

    toast.success('Order Placed Successfully!', { duration: 4000 });
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );

    fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.error('Failed to update order status in API:', err));

    toast.success(`Order ${orderId} updated to ${status}`);
  };

  // Admin Mutations
  const addProduct = async (newProd: Omit<Product, 'id' | 'createdAt'>): Promise<boolean> => {
    // Process base64 images safely
    const uploadedImages = await Promise.all(
      newProd.images.map((img) => uploadImageIfNeeded(img))
    );

    const prodData = {
      ...newProd,
      images: uploadedImages,
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodData),
      });
      const data = await safeParseJson(res, 'Failed to create product in database');
      if (data.success && data.data) {
        setProducts((prev) => [data.data, ...prev]);
        toast.success('Product Added & Saved to Database!');
        return true;
      } else {
        throw new Error(data.error || 'Failed to create product in database');
      }
    } catch (e: any) {
      console.error('Failed to add product to database:', e);
      toast.error(e?.message || 'Failed to save product in database');
      return false;
    }
  };

  const updateProduct = async (updated: Product): Promise<boolean> => {
    const uploadedImages = await Promise.all(
      updated.images.map((img) => uploadImageIfNeeded(img))
    );

    const prodData = {
      ...updated,
      images: uploadedImages,
    };

    // Optimistic local update
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? prodData : p)));

    try {
      const res = await fetch(`/api/products/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prodData),
      });
      const data = await safeParseJson(res, 'Failed to update product in database');
      if (data.success) {
        if (data.data) {
          setProducts((prev) => prev.map((p) => (p.id === updated.id ? data.data : p)));
        }
        toast.success('Product Details Updated & Saved to Database!');
        return true;
      } else {
        throw new Error(data.error || 'Failed to update product in database');
      }
    } catch (err: any) {
      console.error('Failed to update product in API:', err);
      toast.error(err?.message || 'Failed to save update to database');
      return false;
    }
  };

  const toggleFlashSale = async (productId: string, isFlashSale: boolean): Promise<boolean> => {
    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isFlashSale } : p))
    );

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFlashSale }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isFlashSale ? '⚡ Added to Flash Sale Offers!' : 'Removed from Flash Sale');
        return true;
      } else {
        throw new Error(data.error || 'Failed to update Flash Sale');
      }
    } catch (err) {
      console.error('Failed to toggle Flash Sale:', err);
      // Rollback optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isFlashSale: !isFlashSale } : p))
      );
      toast.error('Failed to update Flash Sale in database');
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete product from database');
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product permanently deleted');
      return true;
    } catch (err: any) {
      console.error('Failed to delete product in API:', err);
      toast.error(err?.message || 'Failed to delete product from database');
      return false;
    }
  };

  const addCategory = async (cat: Omit<Category, 'id'>): Promise<boolean> => {
    let catImage = cat.image || '';
    if (catImage && catImage.startsWith('data:image/')) {
      catImage = await uploadImageIfNeeded(catImage);
    }

    const catData = {
      ...cat,
      parentId: cat.parentId || null,
      image: catImage || null,
    };

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
      });
      const data = await safeParseJson(res, 'Failed to create category');
      if (data.success && data.data) {
        setCategories((prev) => [...prev, data.data]);
        toast.success('Category Created Successfully!');
        return true;
      } else {
        toast.error(data.error || 'Failed to create category');
        return false;
      }
    } catch (e: any) {
      console.error('Failed to add category to API:', e);
      toast.error(e?.message || 'Error creating category in server');
      return false;
    }
  };

  const updateCategory = async (updated: Category): Promise<boolean> => {
    let catImage = updated.image || '';
    if (catImage && catImage.startsWith('data:image/')) {
      catImage = await uploadImageIfNeeded(catImage);
    }

    const catData = {
      ...updated,
      parentId: updated.parentId || null,
      image: catImage || null,
    };

    try {
      const res = await fetch(`/api/categories/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
      });
      const data = await safeParseJson(res, 'Failed to update category');
      if (data.success && data.data) {
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? data.data : c)));
        toast.success('Category Updated Successfully!');
        return true;
      } else {
        toast.error(data.error || 'Failed to update category');
        return false;
      }
    } catch (err: any) {
      console.error('Failed to update category in API:', err);
      toast.error(err?.message || 'Error updating category in server');
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        toast.success('Category Deleted Successfully');
        return true;
      } else {
        toast.error(data.error || 'Failed to delete category');
        return false;
      }
    } catch (err) {
      console.error('Failed to delete category in API:', err);
      toast.error('Error deleting category in server');
      return false;
    }
  };

  const updateSiteSettings = async (newSettings: Partial<SiteSettingsData>) => {
    const updated = { ...siteSettings, ...newSettings };
    setSiteSettings(updated);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success && data.settings) {
        setSiteSettings(data.settings);
        toast.success('Site settings updated successfully');
      }
    } catch (err) {
      console.error('Failed to update site settings:', err);
      toast.error('Failed to save site settings');
    }
  };

  const addStoreLocation = async (storeData: Omit<StoreLocationData, 'id'>) => {
    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      });
      const data = await res.json();
      if (data.success && data.store) {
        setStoreLocations((prev) => [...prev, data.store]);
        toast.success('Store location added!');
      }
    } catch (err) {
      console.error('Failed to add store location:', err);
      toast.error('Failed to add store location');
    }
  };

  const updateStoreLocation = async (store: StoreLocationData) => {
    setStoreLocations((prev) => prev.map((s) => (s.id === store.id ? store : s)));
    try {
      const res = await fetch(`/api/stores/${store.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(store),
      });
      const data = await res.json();
      if (data.success && data.store) {
        setStoreLocations((prev) => prev.map((s) => (s.id === store.id ? data.store : s)));
        toast.success('Store location updated!');
      }
    } catch (err) {
      console.error('Failed to update store location:', err);
      toast.error('Failed to update store location');
    }
  };

  const deleteStoreLocation = async (id: string) => {
    setStoreLocations((prev) => prev.filter((s) => s.id !== id));
    try {
      const res = await fetch(`/api/stores/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Store location deleted');
      }
    } catch (err) {
      console.error('Failed to delete store location:', err);
      toast.error('Failed to delete store location');
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        productsLoaded,
        categories,
        categoriesLoaded,
        banners,
        orders,
        cart,
        wishlist,
        siteSettings,
        storeLocations,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickOrderProduct,
        setQuickOrderProduct,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        getCartSubtotal,
        getCartCount,
        toggleWishlist,
        isInWishlist,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFlashSale,
        addCategory,
        updateCategory,
        deleteCategory,
        updateSiteSettings,
        addStoreLocation,
        updateStoreLocation,
        deleteStoreLocation,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
