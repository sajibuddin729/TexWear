import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Handle JSON payload (e.g. Base64 or image URL)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { image, folder = 'texwear' } = body;

      if (!image) {
        return NextResponse.json(
          { success: false, error: 'No image provided' },
          { status: 400 }
        );
      }

      const uploadResult = await cloudinary.uploader.upload(image, {
        folder,
        resource_type: 'auto',
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    }

    // Handle FormData payload (direct file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || 'texwear';

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file uploaded' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported Content-Type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to upload image to Cloudinary' },
      { status: 500 }
    );
  }
}
