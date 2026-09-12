import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial customer feedbacks...');

  const count = await prisma.feedback.count();
  if (count > 0) {
    console.log(`Already have ${count} feedbacks. Skipping seed.`);
    return;
  }

  const feedbacks = [
    {
      name: 'Tanvir Hossain',
      email: 'tanvir.h@gmail.com',
      phone: '01711223344',
      rating: 5,
      category: 'Product Quality',
      comment:
        'Bought a premium embroidered Panjabi for Eid and the fitting was spot on! The cotton fabric is pure and breathable for Dhaka weather. Highly recommend Tex Wear!',
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
    {
      name: 'Nusrat Jahan',
      email: 'nusrat.j@yahoo.com',
      phone: '01822334455',
      rating: 5,
      category: 'Delivery Speed',
      comment:
        'Ordered a Salwar Kameez suit yesterday afternoon and received home delivery in Dhanmondi today morning! Super quick delivery and the packaging was luxury grade.',
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    },
    {
      name: 'Mahmudur Rahman',
      email: 'mahmud.tex@outlook.com',
      phone: '01933445566',
      rating: 5,
      category: 'Sizing & Fit',
      comment:
        'Casual button-down shirts have the exact European slim cut. The collar stiffness and button quality feel like imported international brands at half the price.',
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
    },
    {
      name: 'Farhana Akter',
      email: 'farhana.akter@gmail.com',
      phone: '01644556677',
      rating: 5,
      category: 'Customer Support',
      comment:
        'I needed an exchange for one size larger on my polo shirt. The support team arranged a doorstep replacement in Banani within 24 hours without any hassle.',
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), // 12 days ago
    },
    {
      name: 'Zubair Al Mamun',
      email: 'zubair.mamun@gmail.com',
      phone: '01755667788',
      rating: 4,
      category: 'Store Experience',
      comment:
        'Visited the Banani showroom. Very clean presentation and polite staff. Would love to see more shoe collections added in the future!',
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    },
    {
      name: 'Rashedul Karim',
      email: 'rashed.k@hotmail.com',
      phone: '01866778899',
      rating: 5,
      category: 'Product Quality',
      comment:
        'The dark brown leather derby shoes I ordered are fantastic. Genuine leather aroma and comfortable cushioned insole.',
      status: 'PENDING', // A pending feedback for admin approval test!
      createdAt: new Date(),
    },
  ];

  for (const fb of feedbacks) {
    await prisma.feedback.create({ data: fb });
  }

  console.log('Successfully seeded 6 customer feedbacks (5 Approved, 1 Pending).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
