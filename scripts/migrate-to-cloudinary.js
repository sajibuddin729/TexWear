const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utnecu0h',
  api_key: process.env.CLOUDINARY_API_KEY || '635186917662994',
  api_secret: process.env.CLOUDINARY_API_SECRET || '6l2XgCXnriqMxA5B00JBcxzzz9k',
  secure: true,
});

const prisma = new PrismaClient();

async function uploadBase64ToCloudinary(base64Data, folder) {
  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    resource_type: 'auto',
  });
  return result.secure_url;
}

async function main() {
  console.log('--- Starting Cloudinary Migration for Existing Data ---');

  // 1. Migrate Products
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to check.`);

  for (const product of products) {
    let images = [];
    try {
      images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    } catch {
      images = [product.images];
    }

    if (!Array.isArray(images)) images = [images];

    let hasChange = false;
    const newImages = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (typeof img === 'string' && img.startsWith('data:')) {
        console.log(`Uploading base64 image [${i}] for product "${product.title}" (${(img.length / 1024).toFixed(1)} KB)...`);
        try {
          const cdnUrl = await uploadBase64ToCloudinary(img, 'texwear/products');
          console.log(`  -> Uploaded successfully: ${cdnUrl}`);
          newImages.push(cdnUrl);
          hasChange = true;
        } catch (err) {
          console.error(`  -> Failed to upload image [${i}] for "${product.title}":`, err.message);
          newImages.push(img); // keep original if upload fails
        }
      } else {
        newImages.push(img);
      }
    }

    if (hasChange) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: JSON.stringify(newImages),
        },
      });
      console.log(`✓ Product "${product.title}" updated in database.`);
    } else {
      console.log(`- Product "${product.title}" already uses CDN/links.`);
    }
  }

  // 2. Migrate Categories
  const categories = await prisma.category.findMany();
  console.log(`\nFound ${categories.length} categories to check.`);

  for (const category of categories) {
    if (category.image && category.image.startsWith('data:')) {
      console.log(`Uploading base64 image for category "${category.name}" (${(category.image.length / 1024).toFixed(1)} KB)...`);
      try {
        const cdnUrl = await uploadBase64ToCloudinary(category.image, 'texwear/categories');
        console.log(`  -> Uploaded successfully: ${cdnUrl}`);
        await prisma.category.update({
          where: { id: category.id },
          data: {
            image: cdnUrl,
          },
        });
        console.log(`✓ Category "${category.name}" updated in database.`);
      } catch (err) {
        console.error(`  -> Failed to upload image for "${category.name}":`, err.message);
      }
    } else {
      console.log(`- Category "${category.name}" already uses CDN/URL.`);
    }
  }

  console.log('\n--- Migration Finished Successfully! ---');
}

main()
  .catch((e) => {
    console.error('Fatal Migration Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
