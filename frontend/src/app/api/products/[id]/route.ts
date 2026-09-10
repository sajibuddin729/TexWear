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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: formatProduct(product) });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const dataToUpdate: any = {};

    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.slug !== undefined) dataToUpdate.slug = body.slug;
    if (body.sku !== undefined) dataToUpdate.sku = body.sku;
    if (body.price !== undefined) dataToUpdate.price = Number(body.price);
    if (body.originalPrice !== undefined) dataToUpdate.originalPrice = Number(body.originalPrice);
    if (body.discountPercentage !== undefined) dataToUpdate.discountPercentage = Number(body.discountPercentage);
    if (body.categoryId !== undefined) dataToUpdate.categoryId = body.categoryId;
    if (body.categoryName !== undefined) dataToUpdate.categoryName = body.categoryName;
    if (body.images !== undefined) dataToUpdate.images = JSON.stringify(body.images);
    if (body.sizes !== undefined) dataToUpdate.sizes = JSON.stringify(body.sizes);
    if (body.colors !== undefined) dataToUpdate.colors = JSON.stringify(body.colors);
    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.details !== undefined) dataToUpdate.details = JSON.stringify(body.details);
    if (body.stockCount !== undefined) {
      dataToUpdate.stockCount = Number(body.stockCount);
      dataToUpdate.inStock = Number(body.stockCount) > 0;
    }
    if (body.isFeatured !== undefined) dataToUpdate.isFeatured = Boolean(body.isFeatured);
    if (body.isBestSeller !== undefined) dataToUpdate.isBestSeller = Boolean(body.isBestSeller);
    if (body.isFlashSale !== undefined) dataToUpdate.isFlashSale = Boolean(body.isFlashSale);
    if (body.isNewArrival !== undefined) dataToUpdate.isNewArrival = Boolean(body.isNewArrival);

    const updated = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, data: formatProduct(updated) });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
