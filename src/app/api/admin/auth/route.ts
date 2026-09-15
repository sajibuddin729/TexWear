import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { passcode } = await req.json();
    const serverPasscode = process.env.ADMIN_PASSCODE || 'texwearlifestyle.com@#';

    if (passcode && passcode.trim() === serverPasscode.trim()) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid Passcode' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin auth verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing request' },
      { status: 500 }
    );
  }
}
