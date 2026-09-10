import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function formatProduct(p: any) {
  return {
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes,
    colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
    details: p.details && typeof p.details === 'string' ? JSON.parse(p.details) : p.details || [],
    createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const isFeatured = searchParams.get('isFeatured');
    const isFlashSale = searchParams.get('isFlashSale');
    const search = searchParams.get('search');

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (isFeatured === 'true') where.isFeatured = true;
    if (isFlashSale === 'true') where.isFlashSale = true;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { sku: { contains: search } },
        { categoryName: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const formatted = products.map(formatProduct);
    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      sku,
      price,
      originalPrice,
      discountPercentage,
      categoryId,
      categoryName,
      images,
      sizes,
      colors,
      description,
      details,
      stockCount,
      isFeatured,
      isBestSeller,
      isFlashSale,
      isNewArrival,
    } = body;

    if (!title || !sku || !price || !categoryId) {
      return NextResponse.json({ success: false, error: 'Title, SKU, Price, and Category are required' }, { status: 400 });
    }

    const calculatedDiscount = discountPercentage || (originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

    const product = await prisma.product.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        sku,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Number(price),
        discountPercentage: calculatedDiscount,
        categoryId,
        categoryName: categoryName || 'Category',
        images: JSON.stringify(images || []),
        sizes: JSON.stringify(sizes || ['M', 'L', 'XL']),
        colors: JSON.stringify(colors || []),
        description: description || '',
        details: JSON.stringify(details || []),
        stockCount: stockCount ? Number(stockCount) : 20,
        inStock: stockCount ? Number(stockCount) > 0 : true,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isFlashSale: Boolean(isFlashSale),
        isNewArrival: Boolean(isNewArrival),
      },
    });

    return NextResponse.json({ success: true, data: formatProduct(product) });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
