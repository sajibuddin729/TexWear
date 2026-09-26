import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const existing = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Message deleted successfully from database' });
  } catch (error: any) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete message' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status: status || 'READ' },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update message' },
      { status: 500 }
    );
  }
}
