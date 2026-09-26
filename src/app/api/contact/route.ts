import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// Helper function to auto-purge messages older than 2 days (48 hours)
async function purgeOldMessages() {
  try {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const result = await prisma.contactMessage.deleteMany({
      where: {
        createdAt: {
          lt: twoDaysAgo,
        },
      },
    });
    if (result.count > 0) {
      console.log(`[Auto-Purge] Deleted ${result.count} contact messages older than 2 days.`);
    }
  } catch (error) {
    console.warn('[Auto-Purge Warning] Could not purge old contact messages:', error);
  }
}

export async function GET() {
  try {
    // Automatically delete messages older than 2 days on fetch
    await purgeOldMessages();

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch contact messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, message } = body;

    if (!name || !contact || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, Email/Mobile Number, and Message are required' },
        { status: 400 }
      );
    }

    // Auto-clean any expired messages
    await purgeOldMessages();

    const created = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        contact: contact.trim(),
        message: message.trim(),
        status: 'UNREAD',
      },
    });

    return NextResponse.json({
      success: true,
      data: created,
      message: 'Your message has been sent to TEX WEAR support successfully!',
    });
  } catch (error: any) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
