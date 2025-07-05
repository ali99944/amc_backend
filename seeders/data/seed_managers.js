import argon2 from 'argon2';

/**
 * Seeds managers into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @returns {Promise<void>}
 */
export async function seedManagers(prisma) {
  const managers = await prisma.managers.createMany({
    data: [
      {
        name: 'Olivia Carter',
        username: 'admin',
        password: await argon2.hash('admin'),
        role: 'super_admin',
      },
      {
        name: 'James Lee',
        username: 'james.lee@admin.com',
        password: await argon2.hash('Admin123!'),
        role: 'admin',
      },
    ],
    skipDuplicates: true,
  });
  console.log(`Seeded ${managers.count} managers`);
}