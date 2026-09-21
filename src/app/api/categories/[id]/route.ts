import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, image, parentId, highlightColor, itemCount } = body;

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

    // Unlink any subcategories that point to this parent category
    await prisma.category.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    });

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete category' }, { status: 500 });
  }
}
