import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, address, phone, hours, mapUrl, isFlagship } = body;

    const store = await prisma.storeLocation.update({
      where: { id },
      data: {
        name,
        address,
        phone,
        hours,
        mapUrl,
        isFlagship: Boolean(isFlagship),
      },
    });

    return NextResponse.json({ success: true, store });
  } catch (error) {
    console.error('Error updating store location:', error);
    return NextResponse.json({ success: false, error: 'Failed to update store location' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.storeLocation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store location:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete store location' }, { status: 500 });
  }
}
