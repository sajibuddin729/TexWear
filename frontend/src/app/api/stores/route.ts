import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_STORES } from '@/data/initialData';

export async function GET() {
  try {
    let stores = await prisma.storeLocation.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (stores.length === 0) {
      for (const store of INITIAL_STORES) {
        await prisma.storeLocation.create({
          data: {
            id: store.id,
            name: store.name,
            address: store.address,
            phone: store.phone,
            hours: store.hours,
            isFlagship: store.isFlagship || false,
          },
        });
      }
      stores = await prisma.storeLocation.findMany({
        orderBy: { createdAt: 'asc' },
      });
    }

    return NextResponse.json({ success: true, stores });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, phone, hours, mapUrl, isFlagship } = body;

    const store = await prisma.storeLocation.create({
      data: {
        name,
        address,
        phone,
        hours: hours || '10:00 AM - 9:30 PM (7 Days Open)',
        mapUrl: mapUrl || null,
        isFlagship: Boolean(isFlagship),
      },
    });

    return NextResponse.json({ success: true, store });
  } catch (error) {
    console.error('Error creating store location:', error);
    return NextResponse.json({ success: false, error: 'Failed to create store location' }, { status: 500 });
  }
}
