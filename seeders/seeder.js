import { seedGenres } from './data/seed_genres.js';
import { seedUsers } from './data/seed_users.js';
import { seedArtists } from './data/seed_artists.js';
import { seedSongs } from './data/seed_songs.js';
import { seedPlaylists } from './data/seed_playlists.js';
import { seedPlaylistSongs } from './data/seed_playlist_songs.js';
import { seedUserPlaylists } from './data/seed_user_playlists.js';
import { seedUserPlaylistSongs } from './data/seed_user_playlist_songs.js';
import { seedSongPlays } from './data/seed_song_plays.js';
import { seedManagers } from './data/seed_managers.js';
import { seedUserFavoriteSongs } from './data/seed_user_favorite_songs.js';
import { seedUserFavoriteArtists } from './data/seed_user_favorite_artists.js';
import { seedUserGenreInterests } from './data/seed_user_genre_interests.js';
import { seedUserArtistInterests } from './data/seed_user_artist_interests.js';

import prisma from '../lib/prisma.js';
import { seedPrivacyPolicy } from './data/seed_privacy_policy.js';
import { seedTermsConditions } from './data/seed_terms_condition.js';


async function main() {
  console.log('Starting database seeding...');

  // Seed entities in dependency order
  await seedGenres(prisma);
  const createdGenres = await prisma.genres.findMany();
  await seedUsers(prisma);
  const createdUsers = await prisma.users.findMany();
  await seedArtists(prisma);
  const createdArtists = await prisma.artists.findMany();

  await seedSongs(prisma, createdArtists);
  const createdSongs = await prisma.songs.findMany();
  await seedPlaylists(prisma);
  const createdPlaylists = await prisma.playlists.findMany();
  await seedPlaylistSongs(prisma, createdPlaylists, createdSongs);
  await seedUserPlaylists(prisma, createdUsers);
  const createdUserPlaylists = await prisma.user_playlists.findMany();
  await seedUserPlaylistSongs(prisma, createdUserPlaylists, createdSongs);
  await seedSongPlays(prisma, createdUsers, createdSongs);
  await seedManagers();

  await seedUserFavoriteSongs(prisma, createdUsers, createdSongs);
  await seedUserFavoriteArtists(prisma, createdUsers, createdArtists);
  await seedUserGenreInterests(prisma, createdUsers, createdGenres);
  await seedUserArtistInterests(prisma, createdUsers, createdArtists);

  await seedPrivacyPolicy()
  await seedTermsConditions()

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