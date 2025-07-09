import argon2 from 'argon2';
import prisma from '../../lib/prisma.js';

/**
 * Seeds managers into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @returns {Promise<void>}
 */
export async function seedManagers() {
  const managers = await prisma.managers.createMany({
    data: [
      {
        name: 'Mutaz Abu Baker',
        username: 'mutaz',
        password: await argon2.hash('mutaz'),
        role: 'super_admin',
      },
      {
        name: 'Developer Admin',
        username: 'developer',
        password: await argon2.hash('dev'),
        role: 'super_admin',
      },
      {
        name: 'Ali Media Center',
        username: 'amc',
        password: await argon2.hash('amc'),
        role: 'super_admin',
      },
    ],
    skipDuplicates: true,
  });
  console.log(`Seeded ${managers.count} managers`);
}