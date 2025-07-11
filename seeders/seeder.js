import { seedManagers } from './data/seed_managers.js';

import prisma from '../lib/prisma.js';
import { seedPrivacyPolicy } from './data/seed_privacy_policy.js';
import { seedTermsConditions } from './data/seed_terms_condition.js';
import { seedUsers } from './data/seed_users.js';
import { seedLanguages } from './data/seed_languages.js';


async function main() {
  console.log('Starting database seeding...');


  await seedUsers()
  await seedManagers();
  await seedPrivacyPolicy()
  await seedTermsConditions()
  await seedLanguages()

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });