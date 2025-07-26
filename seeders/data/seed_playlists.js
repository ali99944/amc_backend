import argon2 from 'argon2';
import prisma from '../../lib/prisma.js';

export async function seedPlaylists() {
  const playlistsData = [
    {
      name: 'Recommended Hits 2025',
      description: 'Top recommended tracks for 2025 based on your listening habits.',
      image: 'https://img.example.com/playlists/recommended-hits-2025.jpg',
      type: 'system',
      source: 'recommended',
      isActive: true,
      createdAt: new Date('2025-01-01T08:00:00Z'),
      songs: {
        create: [
          { song_id: 1 },
          { song_id: 2 },
        ],
      },
    },
    {
      name: 'Recommended Vibes',
      description: 'A mix of songs tailored to your taste.',
      image: 'https://img.example.com/playlists/recommended-vibes.jpg',
      type: 'system',
      source: 'recommended',
      isActive: true,
      createdAt: new Date('2025-02-01T08:00:00Z'),
      songs: {
        create: [
            { song_id: 1 },
          { song_id: 2 },
          { song_id: 3 },
          { song_id: 4 },
        ],
      },
    },
    {
      name: 'Trending Now',
      description: 'The hottest tracks trending this week.',
      image: 'https://img.example.com/playlists/trending-now.jpg',
      type: 'system',
      source: 'trending',
      isActive: true,
      createdAt: new Date('2025-03-01T08:00:00Z'),
      songs: {
        create: [
          { song_id: 2 },
          { song_id: 5 },
        ],
      },
    },
    {
      name: 'Global Trends',
      description: 'What the world is listening to right now.',
      image: 'https://img.example.com/playlists/global-trends.jpg',
      type: 'system',
      source: 'trending',
      isActive: true,
      createdAt: new Date('2025-04-01T08:00:00Z'),
      songs: {
        create: [
          { song_id: 1 },
          { song_id: 3 },
        ],
      },
    },
    {
      name: 'Curated Classics',
      description: 'Handpicked timeless tracks by our editors.',
      image: 'https://img.example.com/playlists/curated-classics.jpg',
      type: 'system',
      source: 'curated',
      isActive: true,
      createdAt: new Date('2025-05-01T08:00:00Z'),
      songs: {
        create: [
          { song_id: 4 },
          { song_id: 5 },
        ],
      },
    },
    {
      name: 'Curated New Finds',
      description: 'Fresh picks from up-and-coming artists.',
      image: 'https://img.example.com/playlists/curated-new-finds.jpg',
      type: 'system',
      source: 'curated',
      isActive: true,
      createdAt: new Date('2025-06-01T08:00:00Z'),
      songs: {
        create: [
          { song_id: 2 },
          { song_id: 3 },
        ],
      },
    },
    {
      name: 'Editorial Picks',
      description: 'Our editors’ favorite songs of the season.',
      image: 'https://img.example.com/playlists/editorial-picks.jpg',
      type: 'system',
      source: 'editorial',
      isActive: true,
      createdAt: new Date('2025-07-01T08:00:00Z'),
      songs: {
        create: [
          { song_id: 1 },
          { song_id: 4 },
        ],
      },
    },
    {
      name: 'Editorial Spotlight',
      description: 'Highlighting the best in music this month.',
      image: 'https://img.example.com/playlists/editorial-spotlight.jpg',
      type: 'system',
      source: 'editorial',
      isActive: true,
      createdAt: new Date('2025-07-10T08:00:00Z'),
      songs: {
        create: [
          { song_id: 3 },
          { song_id: 5 },
        ],
      },
    },
    {
      name: 'AI Mix Vol. 1',
      description: 'An AI-generated playlist for your mood.',
      image: 'https://img.example.com/playlists/ai-mix-vol1.jpg',
      type: 'system',
      source: 'ai',
      isActive: true,
      createdAt: new Date('2025-06-10T08:00:00Z'),
      songs: {
        create: [
          { song_id: 1 },
          { song_id: 2 },
        ],
      },
    },
    {
      name: 'AI Chill Vibes',
      description: 'Relax with this AI-curated chill playlist.',
      image: 'https://img.example.com/playlists/ai-chill-vibes.jpg',
      type: 'system',
      source: 'ai',
      isActive: true,
      createdAt: new Date('2025-06-15T08:00:00Z'),
      songs: {
        create: [
          { song_id: 4 },
          { song_id: 5 },
        ],
      },
    },
  ];

  const createdPlaylists = await prisma.$transaction(
    playlistsData.map((playlistData) =>
      prisma.playlists.create({
        data: playlistData,
      })
    )
  );

  console.log(`Seeded ${createdPlaylists.length} playlists`);
}