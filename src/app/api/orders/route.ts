import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerCity,
      customerNotes,
      paymentMethod,
      items,
      subtotal,
      shippingFee,
      discount,
      totalAmount,
    } = body;

    if (!customerName || !customerPhone || !customerAddress || !items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing required customer or items data' }, { status: 400 });
    }

    const orderId = `TW-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = await prisma.order.create({
      data: {
        orderId,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        customerAddress,
        customerCity: customerCity || 'Dhaka',
        customerNotes: customerNotes || null,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        subtotal: Number(subtotal),
        shippingFee: Number(shippingFee || 80),
        discount: Number(discount || 0),
        totalAmount: Number(totalAmount),
        status: 'Pending',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || item.id,
            title: item.title,
            price: Number(item.price),
            quantity: Number(item.qty || item.quantity || 1),
            size: item.selectedSize || item.size || null,
            colorName: item.selectedColor?.name || item.colorName || null,
            image: item.image || (Array.isArray(item.images) ? item.images[0] : null),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
