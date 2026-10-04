import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, image, parentId, highlightColor, itemCount } = body;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
      select: { image: true },
    });

    // If category image changed or removed, delete the old image from Cloudinary
    if (image !== undefined && existingCategory?.image && existingCategory.image !== image) {
      try {
        await deleteFromCloudinary(existingCategory.image);
      } catch (cloudErr) {
        console.warn('Failed to delete old category image from Cloudinary:', cloudErr);
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(image !== undefined && { image: image || null }),
        ...(parentId !== undefined && { parentId: parentId ? parentId : null }),
        ...(highlightColor !== undefined && { highlightColor }),
        ...(itemCount !== undefined && { itemCount }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // 1. Fetch category to get its image URL
    const category = await prisma.category.findUnique({
      where: { id },
      select: { image: true },
    });

    // 2. If image exists on Cloudinary, delete it
    if (category?.image) {
      try {
        await deleteFromCloudinary(category.image);
      } catch (cloudErr) {
        console.warn('Failed to delete category image from Cloudinary:', cloudErr);
      }
    }

    // 3. Unlink any subcategories that point to this parent category
    await prisma.category.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    });

    // 4. Delete category from database
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Category and Cloudinary image deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete category' }, { status: 500 });
  }
}
