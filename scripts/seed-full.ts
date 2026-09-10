import { PrismaClient } from '@prisma/client';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_STORES } from '../src/data/initialData';

const prisma = new PrismaClient();

async function seed() {
  console.log('🔄 Cleaning old database categories and products...');
  await prisma.orderItem.deleteMany().catch(() => {});
  await prisma.order.deleteMany().catch(() => {});
  await prisma.product.deleteMany().catch(() => {});
  await prisma.category.deleteMany().catch(() => {});

  console.log('✨ Seeding ALL 12+ Categories with authentic Bangladeshi apparel images...');
  
  // First seed parent categories
  const parentCats = INITIAL_CATEGORIES.filter(c => !c.parentId);
  for (const cat of parentCats) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image || null,
        itemCount: cat.itemCount || 0,
        highlightColor: cat.highlightColor || null,
      },
    });
  }

  // Next seed subcategories
  const subCats = INITIAL_CATEGORIES.filter(c => c.parentId);
  for (const cat of subCats) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image || null,
        itemCount: cat.itemCount || 0,
        highlightColor: cat.highlightColor || null,
        parentId: cat.parentId,
      },
    });
  }
  console.log('✅ Categories seeded successfully!');

  console.log('👕 Seeding all 19+ authentic Bangladeshi apparel products...');
  for (const prod of INITIAL_PRODUCTS) {
    await prisma.product.create({
      data: {
        id: prod.id,
        title: prod.title,
        slug: prod.slug,
        sku: prod.sku,
        price: Number(prod.price),
        originalPrice: prod.originalPrice ? Number(prod.originalPrice) : Number(prod.price),
        discountPercentage: prod.discountPercentage || 0,
        categoryId: prod.categoryId,
        categoryName: prod.categoryName,
        images: JSON.stringify(prod.images || []),
        sizes: JSON.stringify(prod.sizes || ['M', 'L', 'XL']),
        colors: JSON.stringify(prod.colors || []),
        description: prod.description || '',
        details: JSON.stringify(prod.details || []),
        stockCount: prod.stockCount || 30,
        inStock: true,
        isFeatured: Boolean(prod.isFeatured),
        isBestSeller: Boolean(prod.isBestSeller),
        isFlashSale: Boolean(prod.isFlashSale),
        isNewArrival: Boolean(prod.isNewArrival),
        rating: prod.rating || 4.8,
        reviewCount: prod.reviewCount || 20,
      },
    });
  }
  console.log('✅ Products seeded successfully!');

  console.log('⚙️ Seeding Site Settings...');
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      storeName: INITIAL_SETTINGS.storeName,
      phone: INITIAL_SETTINGS.phone,
      email: INITIAL_SETTINGS.email,
      address: INITIAL_SETTINGS.address,
      marqueeAnnouncement: INITIAL_SETTINGS.marqueeAnnouncement,
      facebookUrl: INITIAL_SETTINGS.facebookUrl,
      instagramUrl: INITIAL_SETTINGS.instagramUrl,
    },
    create: {
      id: 'default',
      storeName: INITIAL_SETTINGS.storeName,
      phone: INITIAL_SETTINGS.phone,
      email: INITIAL_SETTINGS.email,
      address: INITIAL_SETTINGS.address,
      marqueeAnnouncement: INITIAL_SETTINGS.marqueeAnnouncement,
      facebookUrl: INITIAL_SETTINGS.facebookUrl,
      instagramUrl: INITIAL_SETTINGS.instagramUrl,
    },
  });

  console.log('📍 Seeding Store Locations...');
  await prisma.storeLocation.deleteMany().catch(() => {});
  for (const st of INITIAL_STORES) {
    await prisma.storeLocation.create({
      data: {
        id: st.id,
        name: st.name,
        address: st.address,
        phone: st.phone,
        hours: st.hours,
        isFlagship: Boolean(st.isFlagship),
      },
    });
  }
  console.log('✅ Store Locations seeded successfully!');

  console.log('🎉 ALL DATA FULLY SEEDED INTO VERCEL POSTGRES DATABASE!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
