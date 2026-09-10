import { Category, Product, Banner, Order } from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-summer',
    name: 'SUMMER COLLECTION',
    slug: 'summer-collection',
    image: '/categories/cat-summer.jpg',
    itemCount: 24,
    highlightColor: '#12750b',
  },
  {
    id: 'cat-men',
    name: 'MEN',
    slug: 'men',
    image: '/categories/cat-men.jpg',
    itemCount: 42,
  },
  // Subcategories under MEN
  {
    id: 'cat-mens-ethnic',
    name: "MEN'S ETHNIC",
    slug: 'mens-ethnic',
    parentId: 'cat-men',
    image: '/categories/cat-mens-ethnic.jpg',
    itemCount: 18,
  },
  {
    id: 'cat-casual-shirt',
    name: 'CASUAL SHIRT',
    slug: 'casual-shirt',
    parentId: 'cat-men',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&h=600&q=80',
    itemCount: 30,
  },
  {
    id: 'cat-formal-shirt',
    name: 'FORMAL SHIRT',
    slug: 'formal-shirt',
    parentId: 'cat-men',
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=600&h=600&q=80',
    itemCount: 12,
  },
  {
    id: 'cat-polo',
    name: 'POLO SHIRT',
    slug: 'polo-shirt',
    parentId: 'cat-men',
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&h=600&q=80',
    itemCount: 15,
  },
  {
    id: 'cat-tshirt',
    name: 'T-SHIRT',
    slug: 't-shirt',
    parentId: 'cat-men',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&h=600&q=80',
    itemCount: 28,
  },
  {
    id: 'cat-pants',
    name: 'PANTS & DENIM',
    slug: 'pants',
    parentId: 'cat-men',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&h=600&q=80',
    itemCount: 22,
  },

  // WOMENS Categories
  {
    id: 'cat-women',
    name: 'WOMENS',
    slug: 'womens',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80',
    itemCount: 36,
  },
  {
    id: 'cat-kameez',
    name: 'SALWAR KAMEEZ & KURTI',
    slug: 'kameez',
    parentId: 'cat-women',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    itemCount: 25,
    highlightColor: '#f5199a',
  },
  {
    id: 'cat-saree',
    name: 'SAREE COLLECTION',
    slug: 'saree',
    parentId: 'cat-women',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    itemCount: 19,
  },
  {
    id: 'cat-abaya',
    name: 'BURQA & ABAYA',
    slug: 'burqa-abaya',
    parentId: 'cat-women',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    itemCount: 10,
  },

  // JUNIOR & KIDS
  {
    id: 'cat-junior',
    name: 'JUNIOR & KIDS',
    slug: 'junior',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80',
    itemCount: 14,
  },

  // ACCESSORIES
  {
    id: 'cat-accessories',
    name: 'ACCESSORIES',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    itemCount: 20,
  },
];

export interface SiteSettingsData {
  storeName: string;
  phone: string;
  email: string;
  address: string;
  marqueeAnnouncement: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

export interface StoreLocationData {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapUrl?: string;
  isFlagship?: boolean;
}

export const INITIAL_SETTINGS: SiteSettingsData = {
  storeName: 'TEX WEAR Life Style',
  phone: '+8801623446677',
  email: 'support@texwear.com',
  address: 'House 42, Road 11, Block D, Banani, Dhaka-1213',
  marqueeAnnouncement: 'Welcome to TEX WEAR Life Style — Premium Fashion & Lifestyle | Home Delivery Nationwide!',
  facebookUrl: 'https://facebook.com/texwearbd',
  instagramUrl: 'https://instagram.com/texwearbd',
};

export const INITIAL_STORES: StoreLocationData[] = [
  {
    id: 'store-1',
    name: 'Tex Wear Flagship Store - Banani',
    address: 'House 42, Road 11, Block D, Banani, Dhaka',
    phone: '+8801623446677',
    hours: '10:00 AM - 9:30 PM (7 Days Open)',
    isFlagship: true,
  },
  {
    id: 'store-2',
    name: 'Tex Wear Store - Uttara Sector 3',
    address: 'Building 14, Sonargaon Janapath Road, Sector 3, Uttara, Dhaka',
    phone: '+8801623446678',
    hours: '10:00 AM - 9:30 PM',
  },
  {
    id: 'store-3',
    name: 'Tex Wear Outlet - Dhanmondi 27',
    address: 'Rapa Plaza, Level 2, Dhanmondi 27, Dhaka',
    phone: '+8801623446679',
    hours: '10:00 AM - 9:30 PM',
  },
  {
    id: 'store-4',
    name: 'Tex Wear Outlet - Chittagong GEC',
    address: 'GEC Circle, East Nasirabad, Chittagong',
    phone: '+8801623446680',
    hours: '10:00 AM - 9:00 PM',
  },
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'ELEGANCE DEFINED FOR FESTIVE 2026',
    subtitle: 'Discover Premium Panjabi & Ethnic Fashion Collection',
    buttonText: 'SHOP ETHNIC COLLECTION',
    link: '/category/mens-ethnic',
    image: '/banners/hero-ethnic.jpg',
  },
  {
    id: 'banner-2',
    title: 'MODERN CASUAL & FORMAL SHIRTS',
    subtitle: 'Crafted with 100% Breathable Cotton & Modern Tailoring',
    buttonText: 'EXPLORE SHIRTS',
    link: '/category/casual-shirt',
    image: '/banners/hero-shirts.jpg',
  },
  {
    id: 'banner-3',
    title: 'ROYAL WOMEN’S KAMEEZ & SAREE',
    subtitle: 'Vibrant Colors, Artisanal Embroidery & Contemporary Fits',
    buttonText: 'SHOP WOMEN',
    link: '/category/womens',
    image: '/banners/hero-women.jpg',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. MEN'S ETHNIC (cat-mens-ethnic)
  {
    id: 'prod-101',
    title: 'TEX WEAR Royal Silk Embroidered Panjabi - Navy Blue',
    slug: 'tex-wear-royal-silk-embroidered-panjabi-navy-blue',
    sku: 'TW-PJ-101',
    price: 2850,
    originalPrice: 3500,
    discountPercentage: 19,
    categoryId: 'cat-mens-ethnic',
    categoryName: "MEN'S ETHNIC",
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Navy Blue', hex: '#0f172a' },
      { name: 'Maroon', hex: '#800000' },
      { name: 'Olive Green', hex: '#556b2f' },
    ],
    description: 'Elevate your festive look with TEX WEAR Signature Embroidered Silk Blend Panjabi. Features meticulous neckline detailing, comfortable relaxed fit, and breathable fabric ideal for warm festive days.',
    details: [
      'Fabric: Premium Silk Cotton Blend',
      'Fit: Modern Slim Fit',
      'Pattern: Delicate Mandarin collar embroidery',
      'Care: Dry Clean Recommended / Handwash Cold',
    ],
    inStock: true,
    stockCount: 45,
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    rating: 4.9,
    reviewCount: 38,
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'prod-102',
    title: 'TEX WEAR Jacquard Weave Festive Panjabi - Cream Gold',
    slug: 'tex-wear-jacquard-weave-festive-panjabi-cream-gold',
    sku: 'TW-PJ-102',
    price: 3200,
    originalPrice: 3950,
    discountPercentage: 19,
    categoryId: 'cat-mens-ethnic',
    categoryName: "MEN'S ETHNIC",
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Cream Gold', hex: '#fef3c7' },
      { name: 'Royal White', hex: '#ffffff' },
    ],
    description: 'Luxurious Jacquard self-weave Panjabi crafted for Eid & wedding celebrations. Features custom metal shank buttons and soft cotton inner lining.',
    details: [
      'Fabric: Premium Jacquard Silk Cotton',
      'Buttons: Premium Gold Shank Buttons',
      'Includes: Panjabi only',
    ],
    inStock: true,
    stockCount: 30,
    isNewArrival: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 22,
    createdAt: '2026-08-02T10:00:00Z',
  },
  {
    id: 'prod-103',
    title: 'TEX WEAR Premium Velvet Waistcoat / Koti - Dark Charcoal',
    slug: 'tex-wear-premium-velvet-waistcoat-koti-dark-charcoal',
    sku: 'TW-KT-103',
    price: 2450,
    originalPrice: 2950,
    discountPercentage: 17,
    categoryId: 'cat-mens-ethnic',
    categoryName: "MEN'S ETHNIC",
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Dark Charcoal', hex: '#1e293b' },
      { name: 'Deep Maroon', hex: '#450a0a' },
    ],
    description: 'Tailored 5-button waistcoat / Koti designed to pair with classic white or navy Panjabi. Features satin lining and adjustable back cinch strap.',
    details: [
      'Fabric: High-Density Micro-Velvet',
      'Fit: Tailored Fit',
      'Pocket: 3 exterior welt pockets',
    ],
    inStock: true,
    stockCount: 25,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 18,
    createdAt: '2026-08-03T10:00:00Z',
  },

  // 2. CASUAL SHIRT (cat-casual-shirt)
  {
    id: 'prod-201',
    title: 'TEX WEAR Executive 100% Cotton Printed Casual Shirt',
    slug: 'tex-wear-executive-cotton-printed-casual-shirt',
    sku: 'TW-CS-201',
    price: 1650,
    originalPrice: 2100,
    discountPercentage: 21,
    categoryId: 'cat-casual-shirt',
    categoryName: 'CASUAL SHIRT',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sky Blue Floral', hex: '#38bdf8' },
      { name: 'Navy Micro-Print', hex: '#1e293b' },
    ],
    description: 'Crisp, lightweight, and versatile. The TEX WEAR Executive Printed Shirt pairs effortlessly with chinos or dark denim pants for smart casual workdays and weekend outings.',
    details: [
      'Fabric: 100% Fine Combed Cotton',
      'Sleeve: Full Sleeve with buttoned cuffs',
      'Collar: Standard button-down collar',
    ],
    inStock: true,
    stockCount: 50,
    isNewArrival: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 24,
    createdAt: '2026-08-05T12:00:00Z',
  },
  {
    id: 'prod-202',
    title: 'TEX WEAR Breathable Linen Blend Casual Shirt - Pastel Blue',
    slug: 'tex-wear-breathable-linen-blend-casual-shirt-pastel-blue',
    sku: 'TW-CS-202',
    price: 1850,
    originalPrice: 2300,
    discountPercentage: 19,
    categoryId: 'cat-casual-shirt',
    categoryName: 'CASUAL SHIRT',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Pastel Blue', hex: '#93c5fd' },
      { name: 'Soft Olive', hex: '#a3e635' },
    ],
    description: 'Ultra-breathable linen cotton blend shirt ideal for hot summer months. Features relaxed casual fit and curved hemline.',
    details: [
      'Fabric: 55% Linen, 45% Organic Cotton',
      'Fit: Relaxed Summer Fit',
    ],
    inStock: true,
    stockCount: 40,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 31,
    createdAt: '2026-08-06T12:00:00Z',
  },

  // 3. FORMAL SHIRT (cat-formal-shirt)
  {
    id: 'prod-301',
    title: 'TEX WEAR Solid Executive Egyptian Cotton Formal Shirt - Pure White',
    slug: 'tex-wear-solid-executive-egyptian-cotton-formal-shirt-pure-white',
    sku: 'TW-FS-301',
    price: 1950,
    originalPrice: 2500,
    discountPercentage: 22,
    categoryId: 'cat-formal-shirt',
    categoryName: 'FORMAL SHIRT',
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['39', '40', '41', '42', '43'],
    colors: [
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Light Blue', hex: '#bae6fd' },
    ],
    description: 'Wrinkle-resistant premium formal office shirt. Crafted from 80s 2-ply Egyptian cotton weave with stiff fused collar and convertible cuffs.',
    details: [
      'Fabric: 100% Egyptian Cotton (80s 2-ply)',
      'Finish: Easy-Care Anti-Wrinkle Finish',
      'Fit: Slim Executive Fit',
    ],
    inStock: true,
    stockCount: 60,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 42,
    createdAt: '2026-08-07T10:00:00Z',
  },

  // 4. POLO SHIRT (cat-polo)
  {
    id: 'prod-401',
    title: 'TEX WEAR Signature Pique Cotton Polo Shirt - Deep Teal',
    slug: 'tex-wear-signature-pique-polo-shirt-deep-teal',
    sku: 'TW-PL-401',
    price: 1150,
    originalPrice: 1450,
    discountPercentage: 20,
    categoryId: 'cat-polo',
    categoryName: 'POLO SHIRT',
    images: [
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Deep Teal', hex: '#0d9488' },
      { name: 'Charcoal Black', hex: '#18181b' },
      { name: 'Crisp White', hex: '#ffffff' },
    ],
    description: 'Designed for everyday comfort. Made from high-grade pique knit cotton featuring double-stitched hem and embroidered TW chest monogram.',
    details: [
      'Fabric: 220 GSM Pique Knit Cotton',
      'Fit: Regular Comfort Fit',
      'Logo: Signature TW Monogram Chest Embroidery',
    ],
    inStock: true,
    stockCount: 65,
    isBestSeller: true,
    isFlashSale: true,
    rating: 4.7,
    reviewCount: 52,
    createdAt: '2026-08-08T09:30:00Z',
  },

  // 5. T-SHIRT (cat-tshirt)
  {
    id: 'prod-501',
    title: 'TEX WEAR Graphic Streetwear Heavy Organic Cotton T-Shirt',
    slug: 'tex-wear-graphic-streetwear-heavy-cotton-tshirt',
    sku: 'TW-TS-501',
    price: 790,
    originalPrice: 990,
    discountPercentage: 20,
    categoryId: 'cat-tshirt',
    categoryName: 'T-SHIRT',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Jet Black', hex: '#09090b' },
      { name: 'Oatmeal Beige', hex: '#e2e8f0' },
    ],
    description: 'Relaxed drop-shoulder oversized T-Shirt with minimal typography back print. Made with high-density 240 GSM organic combed cotton.',
    details: [
      'Fabric: 100% 240 GSM Organic Combed Cotton',
      'Fit: Oversized Drop Shoulder Fit',
      'Print: High-density screen print',
    ],
    inStock: true,
    stockCount: 80,
    isFlashSale: true,
    rating: 4.6,
    reviewCount: 41,
    createdAt: '2026-08-15T08:00:00Z',
  },

  // 6. PANTS & DENIM (cat-pants)
  {
    id: 'prod-601',
    title: 'TEX WEAR Premium Stretch Denim Slim Fit Jeans - Indigo Wash',
    slug: 'tex-wear-premium-stretch-denim-slim-fit-jeans',
    sku: 'TW-DN-601',
    price: 1950,
    originalPrice: 2400,
    discountPercentage: 18,
    categoryId: 'cat-pants',
    categoryName: 'PANTS & DENIM',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Indigo Wash', hex: '#1e3a8a' },
      { name: 'Dark Charcoal', hex: '#334155' },
    ],
    description: 'Heavyweight indigo denim with 2% elastane stretch for all-day mobility and shape retention. Features 5-pocket styling and custom copper hardware.',
    details: [
      'Material: 98% Cotton, 2% Elastane',
      'Fit: Modern Slim Fit',
      'Wash: Whiskered Medium Vintage Wash',
    ],
    inStock: true,
    stockCount: 45,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 31,
    createdAt: '2026-08-12T11:00:00Z',
  },
  {
    id: 'prod-602',
    title: 'TEX WEAR Executive Stretch Cotton Chino Pants - Khaki Tan',
    slug: 'tex-wear-executive-stretch-cotton-chino-pants-khaki-tan',
    sku: 'TW-CN-602',
    price: 1750,
    originalPrice: 2150,
    discountPercentage: 18,
    categoryId: 'cat-pants',
    categoryName: 'PANTS & DENIM',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Khaki Tan', hex: '#d97706' },
      { name: 'Navy Blue', hex: '#1e293b' },
    ],
    description: 'Sleek, comfortable stretch twill chino pants for work and casual weekends. Features double rear buttoned pockets and clean flat front.',
    details: [
      'Fabric: 97% Cotton Twill, 3% Spandex',
      'Fit: Slim Straight Fit',
    ],
    inStock: true,
    stockCount: 35,
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 19,
    createdAt: '2026-08-13T11:00:00Z',
  },

  // 7. SALWAR KAMEEZ & KURTI (cat-kameez)
  {
    id: 'prod-701',
    title: 'TEX WEAR Luxury Georgette 3-Piece Embroidered Salwar Kameez',
    slug: 'tex-wear-luxury-georgette-3piece-salwar-kameez',
    sku: 'TW-WK-701',
    price: 4200,
    originalPrice: 5200,
    discountPercentage: 19,
    categoryId: 'cat-kameez',
    categoryName: 'SALWAR KAMEEZ & KURTI',
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Emerald Green', hex: '#059669' },
      { name: 'Rose Pink', hex: '#f472b6' },
    ],
    description: 'Breathtaking 3-piece festive ensemble featuring heavy zari & thread embroidery work, matching dupatta with scalloped borders, and comfortable cotton pants.',
    details: [
      'Included: Kameez, Salwar Pant, Dupatta',
      'Kameez Fabric: Faux Georgette with Cotton Lining',
      'Work: Handcrafted Zari & Sequin Embroidery',
    ],
    inStock: true,
    stockCount: 20,
    isNewArrival: true,
    isFeatured: true,
    rating: 5.0,
    reviewCount: 19,
    createdAt: '2026-08-10T14:15:00Z',
  },
  {
    id: 'prod-702',
    title: 'TEX WEAR Artisanal Printed Cotton Kurti - Mustard & Indigo',
    slug: 'tex-wear-artisanal-printed-cotton-kurti-mustard-indigo',
    sku: 'TW-WK-702',
    price: 1450,
    originalPrice: 1850,
    discountPercentage: 21,
    categoryId: 'cat-kameez',
    categoryName: 'SALWAR KAMEEZ & KURTI',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Mustard Yellow', hex: '#eab308' },
      { name: 'Indigo Blue', hex: '#1d4ed8' },
    ],
    description: 'Comfortable daily wear cotton Kurti with elegant neck embroidery and block-printed floral patterns.',
    details: [
      'Fabric: 100% Breathable Lawn Cotton',
      'Pattern: Traditional Block Print & Threadwork',
    ],
    inStock: true,
    stockCount: 40,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 28,
    createdAt: '2026-08-11T14:15:00Z',
  },

  // 8. SAREE COLLECTION (cat-saree)
  {
    id: 'prod-801',
    title: 'TEX WEAR Traditional Katan Silk Bridal Saree - Ruby Red & Gold',
    slug: 'tex-wear-traditional-katan-silk-bridal-saree-ruby-red',
    sku: 'TW-SR-801',
    price: 5800,
    originalPrice: 7200,
    discountPercentage: 19,
    categoryId: 'cat-saree',
    categoryName: 'SAREE COLLECTION',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['Free Size'],
    colors: [
      { name: 'Ruby Red & Gold', hex: '#dc2626' },
      { name: 'Royal Blue & Zari', hex: '#1d4ed8' },
    ],
    description: 'Heirloom quality Katan Silk Saree rich with woven golden zari motif work across the pallu and body. Includes matching unstitched blouse piece.',
    details: [
      'Fabric: Pure Banarasi Katan Silk',
      'Inclusions: Saree (5.5m) + Matching Blouse Piece (0.8m)',
    ],
    inStock: true,
    stockCount: 15,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 16,
    createdAt: '2026-08-14T16:00:00Z',
  },
  {
    id: 'prod-802',
    title: 'TEX WEAR Handwoven Dhakai Jamdani Saree - Royal Blue',
    slug: 'tex-wear-handwoven-dhakai-jamdani-saree-royal-blue',
    sku: 'TW-SR-802',
    price: 4900,
    originalPrice: 6000,
    discountPercentage: 18,
    categoryId: 'cat-saree',
    categoryName: 'SAREE COLLECTION',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['Free Size'],
    colors: [
      { name: 'Royal Blue', hex: '#1e40af' },
      { name: 'Pastel Pink', hex: '#f472b6' },
    ],
    description: 'Authentic handwoven Dhakai Jamdani saree crafted by master weavers. Feathery lightweight feel with intricate geometric floral threadwork.',
    details: [
      'Fabric: Pure Fine Cotton Jamdani Threadwork',
      'Origin: Handcrafted in Narayanganj, Bangladesh',
    ],
    inStock: true,
    stockCount: 12,
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 14,
    createdAt: '2026-08-15T16:00:00Z',
  },

  // 9. BURQA & ABAYA (cat-abaya)
  {
    id: 'prod-901',
    title: 'TEX WEAR Dubai Cherry Fabric Front-Open Abaya - Jet Black',
    slug: 'tex-wear-dubai-cherry-fabric-front-open-abaya-jet-black',
    sku: 'TW-AB-901',
    price: 2650,
    originalPrice: 3200,
    discountPercentage: 17,
    categoryId: 'cat-abaya',
    categoryName: 'BURQA & ABAYA',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['52', '54', '56'],
    colors: [
      { name: 'Jet Black', hex: '#000000' },
      { name: 'Dark Navy', hex: '#0f172a' },
    ],
    description: 'Premium front-open Dubai Cherry fabric Abaya featuring elegant flared bell sleeves and matching Sheila/Hijab included.',
    details: [
      'Fabric: Original Dubai Cherry Fabric (Non-transparent, breathable)',
      'Included: Abaya + Matching Sheila Hijab',
      'Fit: Flared Modest Cut',
    ],
    inStock: true,
    stockCount: 25,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 27,
    createdAt: '2026-08-16T12:00:00Z',
  },

  // 10. SUMMER COLLECTION (cat-summer)
  {
    id: 'prod-1001',
    title: 'TEX WEAR Ultra-Light Breathable Cotton Summer Kurta Set - Off White',
    slug: 'tex-wear-ultra-light-breathable-cotton-summer-kurta-set',
    sku: 'TW-SM-1001',
    price: 1950,
    originalPrice: 2400,
    discountPercentage: 18,
    categoryId: 'cat-summer',
    categoryName: 'SUMMER COLLECTION',
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Off White', hex: '#f8fafc' },
      { name: 'Soft Mint', hex: '#d1fae5' },
    ],
    description: 'Ultra-lightweight fine cotton short Kurta paired with comfortable draw-string trousers. Perfect for summer heat and casual festive gatherings.',
    details: [
      'Fabric: 100% Organic Super-Soft Summer Cotton',
      'Includes: Short Kurta + Trousers',
    ],
    inStock: true,
    stockCount: 50,
    isFlashSale: true,
    rating: 4.8,
    reviewCount: 35,
    createdAt: '2026-08-17T09:00:00Z',
  },

  // 11. JUNIOR & KIDS (cat-junior)
  {
    id: 'prod-1101',
    title: 'TEX WEAR Kids Festive Cotton Panjabi & Pajama Set - Crimson Red',
    slug: 'tex-wear-kids-festive-cotton-panjabi-pajama-set-crimson-red',
    sku: 'TW-JR-1101',
    price: 1250,
    originalPrice: 1550,
    discountPercentage: 19,
    categoryId: 'cat-junior',
    categoryName: 'JUNIOR & KIDS',
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs'],
    colors: [
      { name: 'Crimson Red', hex: '#b91c1c' },
      { name: 'Royal Blue', hex: '#1d4ed8' },
    ],
    description: 'Adorable 2-piece festive Panjabi set for boys. Made with soft skin-friendly cotton and smooth inner stitching to ensure non-scratchy comfort.',
    details: [
      'Fabric: 100% Skin-Friendly Soft Cotton',
      'Included: Embroidered Panjabi + White Elastic Pajama',
    ],
    inStock: true,
    stockCount: 40,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 21,
    createdAt: '2026-08-18T10:00:00Z',
  },

  // 12. ACCESSORIES (cat-accessories)
  {
    id: 'prod-1201',
    title: 'TEX WEAR Handcrafted Top-Grain Genuine Leather Wallet',
    slug: 'tex-wear-handcrafted-genuine-leather-slim-wallet',
    sku: 'TW-AC-1201',
    price: 1250,
    originalPrice: 1600,
    discountPercentage: 22,
    categoryId: 'cat-accessories',
    categoryName: 'ACCESSORIES',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Vintage Tan Leather', hex: '#92400e' },
      { name: 'Classic Black', hex: '#000000' },
    ],
    description: 'Handcrafted top-grain cowhide leather bifold wallet with RFID blocking protection, 6 card slots, and dual currency compartments.',
    details: [
      'Material: 100% Top-Grain Cow Leather',
      'Features: RFID Safe, 6 Card Slots, Cash Pocket',
    ],
    inStock: true,
    stockCount: 60,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 67,
    createdAt: '2026-08-16T09:00:00Z',
  },
  {
    id: 'prod-1202',
    title: 'TEX WEAR Full-Grain Leather Formal Belt - Mahogany Brown',
    slug: 'tex-wear-full-grain-leather-formal-belt-mahogany-brown',
    sku: 'TW-AC-1202',
    price: 1100,
    originalPrice: 1400,
    discountPercentage: 21,
    categoryId: 'cat-accessories',
    categoryName: 'ACCESSORIES',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['32', '34', '36', '38', '40'],
    colors: [
      { name: 'Mahogany Brown', hex: '#78350f' },
      { name: 'Classic Black', hex: '#000000' },
    ],
    description: 'Solid full-grain leather dress belt with antique brass pin buckle. Hand-burnished edges for long-lasting durability.',
    details: [
      'Material: 100% Genuine Leather',
      'Width: 35mm Executive Standard',
    ],
    inStock: true,
    stockCount: 50,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 33,
    createdAt: '2026-08-17T09:00:00Z',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'TW-849201',
    customer: {
      fullName: 'Sajib Rahman',
      phoneNumber: '01712345678',
      deliveryAddress: 'House 42, Road 11, Block D, Banani',
      districtArea: 'inside_dhaka',
      note: 'Please call before delivery.',
    },
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'L',
        selectedColor: INITIAL_PRODUCTS[0].colors[0],
        quantity: 1,
      },
    ],
    subtotal: 2850,
    shippingFee: 70,
    discount: 0,
    totalAmount: 2920,
    paymentMethod: 'Cash on Delivery',
    status: 'Pending',
    createdAt: '2026-08-20T18:30:00Z',
  },
];
