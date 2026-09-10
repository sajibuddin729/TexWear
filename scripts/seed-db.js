const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: "Men's Wear", slug: "mens-wear", itemCount: 42, highlightColor: "#2563eb" },
  { id: 'cat-2', name: "Women's Ethnic", slug: "womens-ethnic", itemCount: 38, highlightColor: "#e11d48" },
  { id: 'cat-3', name: "Men's Ethnic", slug: "mens-ethnic", itemCount: 25, highlightColor: "#d97706" },
  { id: 'cat-4', name: "Casual & Shirts", slug: "casual-shirts", itemCount: 31, highlightColor: "#059669" },
  { id: 'cat-5', name: "Winter Collection", slug: "winter-collection", itemCount: 19, highlightColor: "#7c3aed" },
];

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    title: "Royal Emerald Embroidered Premium Panjabi",
    slug: "royal-emerald-embroidered-premium-panjabi",
    sku: "TW-PNJ-001",
    price: 3450,
    originalPrice: 4200,
    discountPercentage: 18,
    categoryId: "cat-3",
    categoryName: "Men's Ethnic",
    images: ["/banners/test/ethnic1.jpg", "/banners/hero-ethnic.jpg"],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "Emerald Green", hex: "#064e3b" }, { name: "Navy Blue", hex: "#1e3a8a" }],
    description: "Premium cotton-silk blended embroidered Panjabi crafted for grand festive celebrations and traditional elegance.",
    details: ["100% Premium Cotton Silk Blend", "Intricate neck embroidered detailing", "Custom brand buttons", "Regular comfortable fit"],
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    isNewArrival: false,
    stockCount: 25,
    rating: 4.9,
    reviewCount: 38
  },
  {
    id: "prod-2",
    title: "Luxury Designer Printed Georgette Saree",
    slug: "luxury-designer-printed-georgette-saree",
    sku: "TW-SAR-002",
    price: 4850,
    originalPrice: 5800,
    discountPercentage: 16,
    categoryId: "cat-2",
    categoryName: "Women's Ethnic",
    images: ["/banners/test/women1.jpg", "/banners/hero-women.jpg"],
    sizes: ["Unstitched"],
    colors: [{ name: "Rose Gold", hex: "#b76e79" }, { name: "Deep Maroon", hex: "#800000" }],
    description: "Exquisite designer printed georgette saree featuring intricate lace embroidery borders and matching unstitched blouse piece.",
    details: ["Premium Pure Georgette", "Includes 0.8m unstitched blouse fabric", "Heavy embroidery work border", "Dry clean recommended"],
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: false,
    isNewArrival: true,
    stockCount: 18,
    rating: 4.9,
    reviewCount: 45
  },
  {
    id: "prod-3",
    title: "Modern Slim Fit Linen Cotton Casual Shirt",
    slug: "modern-slim-fit-linen-cotton-casual-shirt",
    sku: "TW-SHT-003",
    price: 1850,
    originalPrice: 2200,
    discountPercentage: 15,
    categoryId: "cat-4",
    categoryName: "Casual & Shirts",
    images: ["/banners/test/shirt1.jpg", "/banners/hero-shirts.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Olive Green", hex: "#556b2f" }, { name: "Sky Blue", hex: "#87ceeb" }],
    description: "Breathable linen-cotton blended slim fit casual shirt ideal for everyday smart casual office and daily wear.",
    details: ["80% Cotton, 20% Linen", "Breathable enzyme washed fabric", "Button-down collar design", "Machine washable"],
    isFeatured: true,
    isBestSeller: false,
    isFlashSale: true,
    isNewArrival: true,
    stockCount: 40,
    rating: 4.7,
    reviewCount: 29
  },
  {
    id: "prod-4",
    title: "Traditional Maroon Jacquard Silk Koti / Waistcoat",
    slug: "traditional-maroon-jacquard-silk-koti",
    sku: "TW-KTI-004",
    price: 2650,
    originalPrice: 3200,
    discountPercentage: 17,
    categoryId: "cat-3",
    categoryName: "Men's Ethnic",
    images: ["/banners/test/ethnic2.jpg"],
    sizes: ["38", "40", "42", "44"],
    colors: [{ name: "Maroon Jacquard", hex: "#800000" }, { name: "Royal Blue", hex: "#00008b" }],
    description: "Elevate your ethnic attire with this royal jacquard silk waist-koti designed for weddings and special occasions.",
    details: ["Jacquard Art Silk Fabric", "Dual front welt pockets", "Satin inner lining", "Dry clean only"],
    isFeatured: false,
    isBestSeller: true,
    isFlashSale: false,
    isNewArrival: false,
    stockCount: 20,
    rating: 4.8,
    reviewCount: 31
  },
  {
    id: "prod-5",
    title: "Elegant Designer Three Piece Anarkali Suit",
    slug: "elegant-designer-three-piece-anarkali-suit",
    sku: "TW-ANK-005",
    price: 5200,
    originalPrice: 6500,
    discountPercentage: 20,
    categoryId: "cat-2",
    categoryName: "Women's Ethnic",
    images: ["/banners/test/women2.jpg"],
    sizes: ["M", "L", "XL"],
    colors: [{ name: "Pastel Pink", hex: "#ffd1dc" }, { name: "Mint Green", hex: "#98ff98" }],
    description: "Graceful 3-piece Anarkali suit set including heavily embroidered kameez, matching pants, and organza dupatta.",
    details: ["Premium Organza & Georgette", "Heavy zardosi neckline embroidery", "Comes with stitched palazzo pant", "Dry clean only"],
    isFeatured: true,
    isBestSeller: false,
    isFlashSale: true,
    isNewArrival: true,
    stockCount: 15,
    rating: 5.0,
    reviewCount: 19
  },
  {
    id: "prod-6",
    title: "Classic Oxford Solid Formal Shirt",
    slug: "classic-oxford-solid-formal-shirt",
    sku: "TW-OXF-006",
    price: 1650,
    originalPrice: 1950,
    discountPercentage: 15,
    categoryId: "cat-4",
    categoryName: "Casual & Shirts",
    images: ["/banners/test/shirt2.jpg"],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [{ name: "Classic White", hex: "#ffffff" }, { name: "Light Blue", hex: "#add8e6" }],
    description: "Crisp 100% premium Oxford cotton formal shirt tailored for clean executive look and full-day comfort.",
    details: ["100% Premium Oxford Cotton", "Wrinkle-resistant finish", "Stiffened collar & cuffs", "Machine washable"],
    isFeatured: false,
    isBestSeller: true,
    isFlashSale: false,
    isNewArrival: false,
    stockCount: 50,
    rating: 4.8,
    reviewCount: 52
  }
];

async function seed() {
  console.log('Seeding Vercel Postgres Database...');
  
  // Seed Categories
  for (const cat of INITIAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, itemCount: cat.itemCount, highlightColor: cat.highlightColor },
      create: cat,
    });
  }
  console.log('Categories seeded!');

  // Seed Products
  for (const prod of INITIAL_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        price: prod.price,
        originalPrice: prod.originalPrice,
        discountPercentage: prod.discountPercentage,
        categoryId: prod.categoryId,
        categoryName: prod.categoryName,
        images: JSON.stringify(prod.images),
        sizes: JSON.stringify(prod.sizes),
        colors: JSON.stringify(prod.colors),
        description: prod.description,
        details: JSON.stringify(prod.details),
      },
      create: {
        id: prod.id,
        title: prod.title,
        slug: prod.slug,
        sku: prod.sku,
        price: prod.price,
        originalPrice: prod.originalPrice,
        discountPercentage: prod.discountPercentage,
        categoryId: prod.categoryId,
        categoryName: prod.categoryName,
        images: JSON.stringify(prod.images),
        sizes: JSON.stringify(prod.sizes),
        colors: JSON.stringify(prod.colors),
        description: prod.description,
        details: JSON.stringify(prod.details),
        stockCount: prod.stockCount,
        inStock: true,
        isFeatured: prod.isFeatured,
        isBestSeller: prod.isBestSeller,
        isFlashSale: prod.isFlashSale,
        isNewArrival: prod.isNewArrival,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
      },
    });
  }
  console.log('Products seeded!');

  // Seed Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      storeName: 'TEX WEAR Life Style',
      phone: '+8801623446677',
      email: 'support@texwear.com',
      address: 'House 42, Road 11, Block D, Banani, Dhaka',
      marqueeAnnouncement: 'Welcome to TEX WEAR Life Style — Premium Fashion & Lifestyle | Home Delivery Nationwide!',
    },
  });
  console.log('Site Settings seeded!');

  // Seed Store Locations
  const storeCount = await prisma.storeLocation.count();
  if (storeCount === 0) {
    await prisma.storeLocation.createMany({
      data: [
        {
          name: 'TEX WEAR Banani Flagship Store',
          address: 'House 42, Road 11, Block D, Banani, Dhaka',
          phone: '+8801623446677',
          hours: '10:00 AM - 9:30 PM (7 Days Open)',
          isFlagship: true,
        },
        {
          name: 'TEX WEAR Dhanmondi Outlet',
          address: 'Shimanto Square, 2nd Floor, Shop 204, Dhanmondi, Dhaka',
          phone: '+8801711223344',
          hours: '10:00 AM - 9:00 PM (7 Days Open)',
          isFlagship: false,
        },
      ],
    });
    console.log('Store Locations seeded!');
  }

  console.log('🎉 Vercel Postgres Database Seeding Complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
