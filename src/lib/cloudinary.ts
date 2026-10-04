import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utnecu0h',
  api_key: process.env.CLOUDINARY_API_KEY || '635186917662994',
  api_secret: process.env.CLOUDINARY_API_SECRET || '6l2XgCXnriqMxA5B00JBcxzzz9k',
  secure: true,
});

/**
 * Extracts the Cloudinary public_id from a full URL.
 * Example: https://res.cloudinary.com/utnecu0h/image/upload/v1791126515/texwear/products/su1zaotkhlzpe2hydvlb.png
 * returns: texwear/products/su1zaotkhlzpe2hydvlb
 */
export function getCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1];
    const versionMatch = afterUpload.match(/(?:^|\/)v\d+\/(.+)$/);
    let publicPathWithExt = versionMatch ? versionMatch[1] : afterUpload;
    const lastDot = publicPathWithExt.lastIndexOf('.');
    if (lastDot !== -1) {
      publicPathWithExt = publicPathWithExt.substring(0, lastDot);
    }
    return publicPathWithExt;
  } catch {
    return null;
  }
}

/**
 * Deletes an image from Cloudinary by its URL or public_id
 */
export async function deleteFromCloudinary(urlOrPublicId: string): Promise<boolean> {
  if (!urlOrPublicId) return false;
  try {
    const publicId = urlOrPublicId.includes('cloudinary.com')
      ? getCloudinaryPublicId(urlOrPublicId)
      : urlOrPublicId;

    if (!publicId) return false;

    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === 'ok';
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
    return false;
  }
}

export default cloudinary;
