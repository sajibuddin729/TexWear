import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/feedback — Get feedbacks (public returns only APPROVED; ?status=ALL or ?status=PENDING for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');

    let whereClause = {};
    if (statusParam && statusParam.toUpperCase() === 'ALL') {
      whereClause = {};
    } else if (statusParam) {
      whereClause = { status: statusParam.toUpperCase() };
    } else {
      // Default public query: only APPROVED feedbacks
      whereClause = { status: 'APPROVED' };
    }

    const feedbacks = await prisma.feedback.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    // Calculate aggregated review stats for approved reviews
    const approvedFeedbacks = await prisma.feedback.findMany({
      where: { status: 'APPROVED' },
      select: { rating: true },
    });

    const totalApproved = approvedFeedbacks.length;
    const avgRating =
      totalApproved > 0
        ? Number((approvedFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalApproved).toFixed(1))
        : 5.0;

    return NextResponse.json({
      success: true,
      data: feedbacks,
      stats: {
        totalApproved,
        averageRating: avgRating,
      },
    });
  } catch (error: any) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}

// POST /api/feedback — Customer submits feedback (starts as PENDING for admin approval)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, rating, category, comment } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Customer name is required' },
        { status: 400 }
      );
    }

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { success: false, error: 'Feedback comment is required' },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5 stars' },
        { status: 400 }
      );
    }

    const newFeedback = await prisma.feedback.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        rating: Math.round(numericRating),
        category: category?.trim() || 'General',
        comment: comment.trim(),
        status: 'PENDING', // Always requires admin approval before showing on site
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newFeedback,
        message: 'Feedback submitted successfully. It will be displayed after admin review.',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
