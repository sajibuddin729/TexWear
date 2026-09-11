import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('👟 Upserting SHOES Category into PostgreSQL Database...');

  const shoesCat = await prisma.category.upsert({
    where: { slug: 'shoes' },
    update: {
      name: 'SHOES',
      image: '/categories/cat-shoes.jpg',
      itemCount: 16,
      highlightColor: '#D4AF37',
    },
    create: {
      id: 'cat-shoes',
      name: 'SHOES',
      slug: 'shoes',
      image: '/categories/cat-shoes.jpg',
      itemCount: 16,
      highlightColor: '#D4AF37',
    },
  });

  console.log('✅ SHOES Category upserted:', shoesCat.id);

  const shoeProducts = [
    {
      id: 'prod-1301',
      title: 'TEX WEAR Handcrafted Italian Leather Monk Strap Shoes - Cognac Tan',
      slug: 'tex-wear-handcrafted-italian-leather-monk-strap-shoes-tan',
      sku: 'TW-SH-1301',
      price: 3450,
      originalPrice: 4200,
      discountPercentage: 18,
      categoryId: shoesCat.id,
      categoryName: 'SHOES',
      images: JSON.stringify([
        '/categories/cat-shoes.jpg',
        '/products/shoe-loafer-1.jpg',
      ]),
      sizes: JSON.stringify(['40', '41', '42', '43', '44']),
      colors: JSON.stringify([
        { name: 'Cognac Tan', hex: '#8B4513' },
        { name: 'Midnight Black', hex: '#000000' },
      ]),
      description: 'Masterfully crafted from premium full-grain Italian calf leather with dual brass buckle monk straps, cushioned memory-foam insole, and durable non-slip rubber outsole.',
      details: JSON.stringify([
        'Upper: 100% Full-Grain Calf Leather',
        'Sole: Anti-Slip Goodyear Welted Rubber',
        'Insole: Breathable Memory Foam Padding',
      ]),
      stockCount: 35,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      rating: 4.9,
      reviewCount: 42,
    },
    {
      id: 'prod-1302',
      title: 'TEX WEAR Classic Oxford Leather Formal Shoes - Jet Black',
      slug: 'tex-wear-classic-oxford-leather-formal-shoes-black',
      sku: 'TW-SH-1302',
      price: 3850,
      originalPrice: 4600,
      discountPercentage: 16,
      categoryId: shoesCat.id,
      categoryName: 'SHOES',
      images: JSON.stringify([
        '/products/shoe-loafer-1.jpg',
        '/categories/cat-shoes.jpg',
      ]),
      sizes: JSON.stringify(['40', '41', '42', '43', '44']),
      colors: JSON.stringify([
        { name: 'Jet Black', hex: '#111111' },
        { name: 'Dark Mahogany', hex: '#4A154B' },
      ]),
      description: 'Timeless executive formal Oxford shoes designed for wedding, corporate and festive banquets. High-gloss polish finish with hand-stitched closed lacing.',
      details: JSON.stringify([
        'Material: 100% Genuine Full-Grain Leather',
        'Lining: Soft Sweat-Resistant Leatherette',
        'Heel: 1-Inch Ergonomic Stacked Wood Heel',
      ]),
      stockCount: 28,
      inStock: true,
      isFeatured: true,
      isBestSeller: false,
      isFlashSale: true,
      isNewArrival: true,
      rating: 4.8,
      reviewCount: 29,
    },
    {
      id: 'prod-1303',
      title: 'TEX WEAR Urban Minimalist Leather Casual Sneakers - Clean White',
      slug: 'tex-wear-urban-minimalist-leather-casual-sneakers-white',
      sku: 'TW-SH-1303',
      price: 2650,
      originalPrice: 3200,
      discountPercentage: 17,
      categoryId: shoesCat.id,
      categoryName: 'SHOES',
      images: JSON.stringify([
        '/products/shoe-sneaker-1.jpg',
        '/categories/cat-shoes.jpg',
      ]),
      sizes: JSON.stringify(['39', '40', '41', '42', '43', '44']),
      colors: JSON.stringify([
        { name: 'Clean White', hex: '#FFFFFF' },
        { name: 'Navy & White', hex: '#071B3B' },
      ]),
      description: 'Clean-cut contemporary leather sneakers featuring breathable perforations, lightweight EVA shock-absorbing cupsole, and flexible casual silhouette.',
      details: JSON.stringify([
        'Upper: Premium Milled Nappa Leather',
        'Sole: Featherlight Ultra-Durable EVA Sole',
        'Lining: Antimicrobial Moisture-Wicking Fabric',
      ]),
      stockCount: 45,
      inStock: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: true,
      rating: 4.9,
      reviewCount: 56,
    },
    {
      id: 'prod-1304',
      title: 'TEX WEAR Handcrafted Traditional Peshawari Leather Sandals - Royal Tan',
      slug: 'tex-wear-handcrafted-traditional-peshawari-leather-sandals-tan',
      sku: 'TW-SH-1304',
      price: 2250,
      originalPrice: 2800,
      discountPercentage: 20,
      categoryId: shoesCat.id,
      categoryName: 'SHOES',
      images: JSON.stringify([
        '/categories/cat-shoes.jpg',
        '/products/shoe-loafer-1.jpg',
      ]),
      sizes: JSON.stringify(['40', '41', '42', '43', '44']),
      colors: JSON.stringify([
        { name: 'Royal Tan', hex: '#8B4513' },
        { name: 'Deep Espresso', hex: '#3E2723' },
      ]),
      description: 'Authentic handcrafted Peshawari style sandal tailored to pair effortlessly with festive Panjabi and Kabli suits. Sturdy buckle closure and tire-tread grip sole.',
      details: JSON.stringify([
        'Material: 100% Genuine Vegetable-Tanned Cowhide',
        'Closure: Adjustable Brass Ankle Buckle',
        'Sole: High-Traction Durable Tyre Rubber',
      ]),
      stockCount: 40,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isFlashSale: true,
      isNewArrival: true,
      rating: 4.9,
      reviewCount: 38,
    },
  ];

  for (const prod of shoeProducts) {
    const p = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        title: prod.title,
        price: prod.price,
        originalPrice: prod.originalPrice,
        discountPercentage: prod.discountPercentage,
        categoryId: prod.categoryId,
        categoryName: prod.categoryName,
        images: prod.images,
        sizes: prod.sizes,
        colors: prod.colors,
        description: prod.description,
        details: prod.details,
        stockCount: prod.stockCount,
        inStock: prod.inStock,
        isFeatured: prod.isFeatured,
        isBestSeller: prod.isBestSeller,
        isFlashSale: prod.isFlashSale,
        isNewArrival: prod.isNewArrival,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
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
        images: prod.images,
        sizes: prod.sizes,
        colors: prod.colors,
        description: prod.description,
        details: prod.details,
        stockCount: prod.stockCount,
        inStock: prod.inStock,
        isFeatured: prod.isFeatured,
        isBestSeller: prod.isBestSeller,
        isFlashSale: prod.isFlashSale,
        isNewArrival: prod.isNewArrival,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
      },
    });
    console.log(`✅ Shoe Product Upserted: ${p.title} (${p.slug})`);
  }

  console.log('🎉 All Shoe products and category successfully synced to Database!');
}

main()
  .catch((e) => {
    console.error('❌ Error in seed-shoes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
