import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_SETTINGS } from '@/data/initialData';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'default',
          ...INITIAL_SETTINGS,
        },
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ success: false, error: error?.message || String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeName, phone, email, address, marqueeAnnouncement, facebookUrl, instagramUrl } = body;

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        storeName,
        phone,
        email,
        address,
        marqueeAnnouncement,
        facebookUrl,
        instagramUrl,
      },
      create: {
        id: 'default',
        storeName,
        phone,
        email,
        address,
        marqueeAnnouncement,
        facebookUrl,
        instagramUrl,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
