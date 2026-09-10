import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from '@/data/initialData';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const force = url.searchParams.get('force') === 'true';

    const existingCatCount = await prisma.category.count();
    
    // Seed Categories
    if (existingCatCount === 0 || force) {
      for (const cat of INITIAL_CATEGORIES) {
        await prisma.category.upsert({
          where: { slug: cat.slug },
          update: {
            name: cat.name,
            image: cat.image || null,
            parentId: cat.parentId || null,
          },
          create: {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            image: cat.image || null,
            itemCount: cat.itemCount || 0,
            highlightColor: cat.highlightColor || null,
            parentId: cat.parentId || null,
          },
        });
      }
    }

    const existingProdCount = await prisma.product.count();

    // Seed Products
    if (existingProdCount === 0 || force) {
      if (force) {
        await prisma.orderItem.deleteMany({}).catch(() => {});
        await prisma.order.deleteMany({}).catch(() => {});
        await prisma.product.deleteMany({}).catch(() => {});
      }

      for (const prod of INITIAL_PRODUCTS) {
        await prisma.product.upsert({
          where: { slug: prod.slug },
          update: {
            title: prod.title,
            price: Number(prod.price),
            originalPrice: prod.originalPrice ? Number(prod.originalPrice) : Number(prod.price),
            categoryId: prod.categoryId,
            categoryName: prod.categoryName,
            images: JSON.stringify(prod.images || []),
            sizes: JSON.stringify(prod.sizes || ['M', 'L', 'XL']),
            colors: JSON.stringify(prod.colors || []),
            description: prod.description || '',
            details: JSON.stringify(prod.details || []),
          },
          create: {
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
    }

    const existingOrderCount = await prisma.order.count();

    // Seed Orders
    if (existingOrderCount === 0) {
      for (const order of INITIAL_ORDERS) {
        await prisma.order.create({
          data: {
            id: order.id,
            orderId: order.orderNumber,
            customerName: order.customer.fullName,
            customerPhone: order.customer.phoneNumber,
            customerEmail: order.customer.alternativePhone || null,
            customerAddress: order.customer.deliveryAddress,
            customerCity: order.customer.districtArea,
            customerNotes: order.customer.note || null,
            paymentMethod: order.paymentMethod,
            subtotal: order.subtotal,
            shippingFee: order.shippingFee,
            discount: order.discount || 0,
            totalAmount: order.totalAmount,
            status: order.status,
            items: {
              create: order.items.map((item) => ({
                productId: item.product.id,
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                size: item.selectedSize || null,
                colorName: item.selectedColor?.name || null,
                image: item.product.images[0] || null,
              })),
            },
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully' });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 });
  }
}
