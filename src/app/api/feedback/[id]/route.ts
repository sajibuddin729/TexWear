import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/feedback/[id] — Update status (e.g. APPROVED, REJECTED, PENDING)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, category } = body;

    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (status && !validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be PENDING, APPROVED, or REJECTED' },
        { status: 400 }
      );
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: {
        ...(status ? { status: status.toUpperCase() } : {}),
        ...(category ? { category } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Feedback status updated to ${updated.status}`,
    });
  } catch (error: any) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update feedback' },
      { status: 500 }
    );
  }
}

// DELETE /api/feedback/[id] — Permanently delete feedback
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete feedback' },
      { status: 500 }
    );
  }
}
