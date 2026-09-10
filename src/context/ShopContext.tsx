'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, OrderCustomer, Banner } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNERS, INITIAL_ORDERS, INITIAL_SETTINGS, INITIAL_STORES, SiteSettingsData, StoreLocationData } from '@/data/initialData';
import toast from 'react-hot-toast';

interface ShopContextType {
  products: Product[];
  categories: Category[];
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
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettingsData>) => Promise<void>;
  addStoreLocation: (store: Omit<StoreLocationData, 'id'>) => Promise<void>;
  updateStoreLocation: (store: StoreLocationData) => Promise<void>;
  deleteStoreLocation: (id: string) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PRODUCTS = 'texwear_products_v3';
const LOCAL_STORAGE_KEY_CATEGORIES = 'texwear_categories_v3';
const LOCAL_STORAGE_KEY_CART = 'texwear_cart_v2';
const LOCAL_STORAGE_KEY_WISHLIST = 'texwear_wishlist_v2';
const LOCAL_STORAGE_KEY_ORDERS = 'texwear_orders_v2';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
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

  // Load data from API / LocalStorage on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Fetch all APIs in parallel for instant page load speed
        const [catRes, prodRes, orderRes, settingsRes, storesRes] = await Promise.allSettled([
          fetch('/api/categories').then((r) => r.json()),
          fetch('/api/products').then((r) => r.json()),
          fetch('/api/orders').then((r) => r.json()),
          fetch('/api/settings').then((r) => r.json()),
          fetch('/api/stores').then((r) => r.json()),
        ]);

        if (catRes.status === 'fulfilled' && catRes.value?.success && Array.isArray(catRes.value.data) && catRes.value.data.length > 0) {
          setCategories(catRes.value.data);
        }

        if (prodRes.status === 'fulfilled' && prodRes.value?.success && Array.isArray(prodRes.value.data) && prodRes.value.data.length > 0) {
          setProducts(prodRes.value.data);
        }

        if (orderRes.status === 'fulfilled' && orderRes.value?.success && Array.isArray(orderRes.value.data) && orderRes.value.data.length > 0) {
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
                images: [i.image || '/updated_logo_textware.png'],
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

        if (storesRes.status === 'fulfilled' && storesRes.value?.success && Array.isArray(storesRes.value.stores) && storesRes.value.stores.length > 0) {
          setStoreLocations(storesRes.value.stores);
        }

        const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY_CART);
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedWishlist = localStorage.getItem(LOCAL_STORAGE_KEY_WISHLIST);
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error loading data from API', e);
      }
    }

    loadInitialData();
  }, []);

  // Save changes to LocalStorage as fallback
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

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

  // Helper function to upload base64 images
  const uploadImageIfNeeded = async (img: string): Promise<string> => {
    if (img.startsWith('data:image/')) {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: img }),
        });
        const data = await res.json();
        if (data.success && data.url) return data.url;
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
  const addProduct = async (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    // Process base64 images
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
      const data = await res.json();
      if (data.success && data.data) {
        setProducts((prev) => [data.data, ...prev]);
        toast.success('Product Added & Saved to Database!');
        return;
      }
    } catch (e) {
      console.error('Failed to add product to API:', e);
    }

    // Fallback local
    const created: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [created, ...prev]);
    toast.success('Product Added Successfully!');
  };

  const updateProduct = async (updated: Product) => {
    const uploadedImages = await Promise.all(
      updated.images.map((img) => uploadImageIfNeeded(img))
    );

    const prodData = {
      ...updated,
      images: uploadedImages,
    };

    setProducts((prev) => prev.map((p) => (p.id === updated.id ? prodData : p)));

    fetch(`/api/products/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodData),
    }).catch((err) => console.error('Failed to update product in API:', err));

    toast.success('Product Details Updated!');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    fetch(`/api/products/${id}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete product in API:', err));

    toast.success('Product Removed');
  };

  const addCategory = async (cat: Omit<Category, 'id'>) => {
    let catImage = cat.image || '';
    if (catImage) {
      catImage = await uploadImageIfNeeded(catImage);
    }

    const catData = {
      ...cat,
      image: catImage,
    };

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCategories((prev) => [...prev, data.data]);
        toast.success('Category Created in Database!');
        return;
      }
    } catch (e) {
      console.error('Failed to add category to API:', e);
    }

    const created: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, created]);
    toast.success('Category Created!');
  };

  const updateCategory = async (updated: Category) => {
    let catImage = updated.image || '';
    if (catImage) {
      catImage = await uploadImageIfNeeded(catImage);
    }

    const catData = {
      ...updated,
      image: catImage,
    };

    setCategories((prev) => prev.map((c) => (c.id === updated.id ? catData : c)));

    fetch(`/api/categories/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catData),
    }).catch((err) => console.error('Failed to update category in API:', err));

    toast.success('Category Updated');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));

    fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    }).catch((err) => console.error('Failed to delete category in API:', err));

    toast.success('Category Deleted');
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
        categories,
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
