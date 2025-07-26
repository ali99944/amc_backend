import { seedManagers } from './data/seed_managers.js';

import prisma from '../lib/prisma.js';
import { seedPrivacyPolicy } from './data/seed_privacy_policy.js';
import { seedTermsConditions } from './data/seed_terms_condition.js';
import { seedUsers } from './data/seed_users.js';
import { seedLanguages } from './data/seed_languages.js';
import { seedGenres } from './data/seed_genres.js';
import { seedArtists } from './data/seed_artists.js';
import { seedSongs } from './data/seed_songs.js';
import { seedAlbums } from './data/seed_albums.js';
import { seedPlaylists } from './data/seed_playlists.js';


async function main() {
  console.log('Starting database seeding...');

  await seedUsers()
  await seedManagers()
  await seedPrivacyPolicy()
  await seedTermsConditions()
  await seedLanguages()
  await seedGenres()
  
  await seedArtists()
  await seedSongs()
  await seedAlbums()
  await seedPlaylists()

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