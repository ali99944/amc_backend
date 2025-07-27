import argon2 from 'argon2';
import prisma from '../../lib/prisma.js';

export async function seedPlaylists() {
  const playlistsData = [
    {
      name: 'Recommended Hits 2025',
      description: 'Top recommended tracks for 2025 based on your listening habits.',
      image: 'https://plus.unsplash.com/premium_photo-1682125511152-549a67b66c4a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bXVzaWMlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D',
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
      image: 'https://images.unsplash.com/photo-1584391889471-9603788c366c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWMlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D',
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
      image: 'https://images.unsplash.com/photo-1646912011157-60804f58f7a2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVzaWMlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D',
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
      image: 'https://plus.unsplash.com/premium_photo-1676999224242-542a42c12740?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG11c2ljJTIwaW1hZ2VzfGVufDB8fDB8fHww',
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
      image: 'https://images.unsplash.com/photo-1618590748055-9bb934ef0055?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG11c2ljJTIwaW1hZ2VzfGVufDB8fDB8fHww',
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
      image: 'https://plus.unsplash.com/premium_photo-1682125816787-4db071ef2da8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fG11c2ljJTIwaW1hZ2VzfGVufDB8fDB8fHww',
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
      image: 'https://images.unsplash.com/photo-1583927109257-f21c74dd0c3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fG11c2ljJTIwaW1hZ2VzfGVufDB8fDB8fHww',
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
      image: 'https://images.unsplash.com/photo-1633882764626-f41b5cc8a1d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fG11c2ljJTIwaW1hZ2VzfGVufDB8fDB8fHww',
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
      image: 'https://images.unsplash.com/photo-1590230851028-843accfaebd8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fG11c2ljJTIwaW1hZ2VzfGVufDB8fDB8fHww',
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
      image: 'https://images.unsplash.com/photo-1648461513577-8521ecdf50c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fG11c2ljJTIwaW1hZ2VzfGVufDB8fDB8fHww',
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