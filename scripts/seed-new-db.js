const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Initializing Data in New Neon Database ---');

  // 1. Categories
  const categoriesData = [
    { id: 'cat-summer', name: 'SUMMER COLLECTION', slug: 'summer-collection', image: 'https://res.cloudinary.com/utnecu0h/image/upload/v1791126527/texwear/categories/adesje7qk8z7cnlubxyf.png', itemCount: 24, highlightColor: '#12750b' },
    { id: 'cat-men', name: 'MEN', slug: 'men', image: '/categories/cat-men.jpg', itemCount: 42 },
    { id: 'cat-womens', name: 'WOMENS', slug: 'womens', image: '/categories/cat-womens-ethnic.jpg', itemCount: 35 },
    { id: 'cat-junior-kids', name: 'JUNIOR & KIDS', slug: 'junior-kids', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=80', itemCount: 18 },
    { id: 'cat-accessories', name: 'ACCESSORIES', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', itemCount: 22 },
    { id: 'cat-mens-ethnic', name: "MEN'S ETHNIC", slug: 'mens-ethnic', parentId: 'cat-men', image: '/categories/cat-mens-ethnic.jpg', itemCount: 18 },
    { id: 'cat-casual-shirt', name: 'CASUAL SHIRT', slug: 'casual-shirt', parentId: 'cat-men', image: 'https://res.cloudinary.com/utnecu0h/image/upload/v1791126533/texwear/categories/gd6dq3kg18x5bmut2sje.jpg', itemCount: 30 },
    { id: 'cat-formal-shirt', name: 'FORMAL SHIRT', slug: 'formal-shirt', parentId: 'cat-men', image: '/categories/cat-shirts.jpg', itemCount: 12 },
    { id: 'cat-polo', name: 'POLO SHIRT', slug: 'polo-shirt', parentId: 'cat-men', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=600&h=600&q=80', itemCount: 15 },
    { id: 'cat-tshirt', name: 'T-SHIRT', slug: 't-shirt', parentId: 'cat-men', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&h=600&q=80', itemCount: 28 },
    { id: 'cat-mens-denim', name: "MEN'S DENIM", slug: 'mens-denim', parentId: 'cat-men', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&h=600&q=80', itemCount: 20 },
    { id: 'cat-salwar-kameez', name: 'SALWAR KAMEEZ & KURTI', slug: 'salwar-kameez-kurti', parentId: 'cat-womens', image: '/categories/cat-womens-ethnic.jpg', itemCount: 16 },
    { id: 'cat-saree', name: 'SAREE COLLECTION', slug: 'saree-collection', parentId: 'cat-womens', image: 'https://res.cloudinary.com/utnecu0h/image/upload/v1791126529/texwear/categories/oz5xunlz1cdv7jncl2d5.jpg', itemCount: 14 },
    { id: 'cat-burqa', name: 'BURQA & ABAYA', slug: 'burqa-abaya', parentId: 'cat-womens', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', itemCount: 10 },
    { id: 'cat-shoes', name: 'SHOES', slug: 'shoes', image: '/categories/cat-shoes.jpg', itemCount: 25 },
    { id: 'cat-cargo', name: 'CARGO', slug: 'cargo', parentId: 'cat-men', image: 'https://res.cloudinary.com/utnecu0h/image/upload/v1791126532/texwear/categories/wfj97jz5zb3hqf94otww.png', itemCount: 15 },
  ];

  // Insert parents first
  for (const cat of categoriesData.filter(c => !c.parentId)) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  // Insert children
  for (const cat of categoriesData.filter(c => c.parentId)) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✓ 16 Categories inserted.');

  // 2. Products
  const productsData = [
    {
      id: 'cmujucn350001jj04t9y73ajp',
      title: 'Gap denim pant',
      slug: 'gap-denim-pant',
      sku: 'TW-PR-GAP-01',
      price: 1850,
      originalPrice: 2200,
      discountPercentage: 16,
      categoryId: 'cat-mens-denim',
      categoryName: "MEN'S DENIM",
      images: JSON.stringify([
        'https://res.cloudinary.com/utnecu0h/image/upload/v1791126506/texwear/products/byidlfcbjalebchpd4pd.jpg'
      ]),
      sizes: JSON.stringify(['30', '32', '34', '36']),
      colors: JSON.stringify([
        { name: 'Blue', hex: '#2563eb' }
      ]),
      description: 'Premium Gap denim pant crafted with stretchable comfortable cotton denim fabric.',
      details: JSON.stringify(['100% Cotton Denim', 'Regular Fit', 'Machine Washable']),
      stockCount: 40,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isFlashSale: false,
      isNewArrival: true,
      rating: 4.8,
      reviewCount: 15,
    },
    {
      id: 'cmue2k42l0001jy044a27f7za',
      title: 'TIME ZONE CARGO',
      slug: 'time-zone-cargo',
      sku: 'TW-PR-TZ-CARGO',
      price: 1950,
      originalPrice: 2400,
      discountPercentage: 19,
      categoryId: 'cat-cargo',
      categoryName: 'CARGO',
      images: JSON.stringify([
        'https://res.cloudinary.com/utnecu0h/image/upload/v1791126508/texwear/products/irkts9ti6x6jcc4cdxso.jpg',
        'https://res.cloudinary.com/utnecu0h/image/upload/v1791126509/texwear/products/z2mcvnikv8rtijx2wjbm.jpg',
        'https://res.cloudinary.com/utnecu0h/image/upload/v1791126509/texwear/products/iyp6bywgvkpzxp60zfkt.jpg',
        'https://res.cloudinary.com/utnecu0h/image/upload/v1791126510/texwear/products/m1fx1aaicd5a68hfdirl.jpg',
        'https://res.cloudinary.com/utnecu0h/image/upload/v1791126511/texwear/products/rgi1lhmgxssdscqu9ytw.jpg',
        'https://res.cloudinary.com/utnecu0h/image/upload/v1791126511/texwear/products/tszp8etwm6edcwauymfh.jpg',
        'https://res.cloudinary.com/utnecu0h/image/upload/v1791126512/texwear/products/togjbgaz4rwdkzxjx3ra.jpg',
        'https://res.cloudinary.com/utnecu0h/image/upload/v1791126513/texwear/products/hmfrhuclzrlc4z9ayplb.jpg'
      ]),
      sizes: JSON.stringify(['30', '32', '34', '36', '38']),
      colors: JSON.stringify([
        { name: 'Olive Green', hex: '#556b2f' },
        { name: 'Khaki', hex: '#c3b091' },
        { name: 'Black', hex: '#000000' }
      ]),
      description: 'Rugged premium Time Zone multi-pocket cargo pants with reinforced stitching.',
      details: JSON.stringify(['6 Pockets', 'Heavy-duty Twill Cotton', 'Relaxed Fit']),
      stockCount: 50,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isFlashSale: false,
      isNewArrival: true,
      rating: 4.9,
      reviewCount: 28,
    },
    {
      id: 'cmucalhn30001l004rdqxztwy',
      title: "American eagle men's denim pant",
      slug: 'american-eagle-mens-denim-pant',
      sku: 'TW-PR-AE-DENIM',
      price: 1950,
      originalPrice: 2350,
      discountPercentage: 17,
      categoryId: 'cat-mens-denim',
      categoryName: "MEN'S DENIM",
      images: JSON.stringify([
        'https://res.cloudinary.com/utnecu0h/image/upload/v1791126515/texwear/products/su1zaotkhlzpe2hydvlb.png'
      ]),
      sizes: JSON.stringify(['30', '32', '34', '36']),
      colors: JSON.stringify([
        { name: 'Dark Indigo', hex: '#1e3a8a' },
        { name: 'Medium Wash', hex: '#3b82f6' }
      ]),
      description: "Authentic American Eagle men's stretch denim with slim straight fit.",
      details: JSON.stringify(['AirFlex+ Stretch', 'Classic 5-pocket styling', 'Durable Hardware']),
      stockCount: 35,
      inStock: true,
      isFeatured: true,
      isBestSeller: false,
      isFlashSale: false,
      isNewArrival: true,
      rating: 4.8,
      reviewCount: 19,
    }
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
  console.log('✓ 3 Products inserted with Cloudinary CDN URLs.');

  // 3. Site Settings
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
      facebookUrl: 'https://facebook.com',
      instagramUrl: 'https://instagram.com',
      youtubeUrl: 'https://youtube.com',
    },
  });
  console.log('✓ Site Settings initialized.');

  // 4. Store Locations
  const storeCount = await prisma.storeLocation.count();
  if (storeCount === 0) {
    await prisma.storeLocation.createMany({
      data: [
        {
          name: 'Banani Flagship Store',
          address: 'House 42, Road 11, Block D, Banani, Dhaka - 1213',
          phone: '+8801623446677',
          hours: '10:00 AM - 10:00 PM (Everyday)',
          isFlagship: true,
        },
        {
          name: 'Dhanmondi Branch',
          address: 'Shimanto Square, Level 3, Shop 312, Dhanmondi, Dhaka',
          phone: '+8801712334455',
          hours: '10:30 AM - 9:30 PM (Weekly Closed: Tuesday)',
          isFlagship: false,
        }
      ]
    });
    console.log('✓ Store Locations initialized.');
  }

  console.log('\n--- All Database Data Initialized Successfully! ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
