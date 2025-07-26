import argon2 from 'argon2';
import prisma from '../../lib/prisma.js';

export async function seedAlbums() {
  const albumsData = [
    {
      name: 'Neon Nights',
      description: 'A collection of synth-pop anthems capturing the essence of the 80s.',
      image: 'https://images.unsplash.com/photo-1492560704044-e15259ca1c61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aXN0JTIwYWxidW18ZW58MHx8MHx8fDA%3D',
      artist_id: 1,
      songs_count: 10,
      genres_count: 2,
      total_duration: 2400,
      release_date: new Date('2024-02-15'),
      is_active: true,
      is_featured: true,
      album_type: 'Album',
      created_at: new Date('2024-02-15T10:00:00Z'),
    },
    {
      name: 'Whispers in the Wind',
      description: 'Soulful folk tunes with heartfelt storytelling.',
      image: 'https://plus.unsplash.com/premium_photo-1689620817526-4963bfc2bc87?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXJ0aXN0JTIwYWxidW18ZW58MHx8MHx8fDA%3D',
      artist_id: 2,
      songs_count: 8,
      genres_count: 1,
      total_duration: 1800,
      release_date: new Date('2024-04-20'),
      is_active: true,
      is_featured: false,
      album_type: 'Album',
      created_at: new Date('2024-04-20T12:00:00Z'),
    },
    {
      name: 'Pulse of the Night',
      description: 'High-energy electronic tracks for late-night vibes.',
      image: 'https://images.unsplash.com/photo-1580642682609-8b6ab251fbb7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFydGlzdCUyMGFsYnVtfGVufDB8fDB8fHww',
      artist_id: 3,
      songs_count: 6,
      genres_count: 2,
      total_duration: 1500,
      release_date: new Date('2023-12-20'),
      is_active: true,
      is_featured: true,
      album_type: 'EP',
      created_at: new Date('2023-12-20T09:00:00Z'),
    },
    {
      name: 'Open Road',
      description: 'A rock journey through the American heartland.',
      image: 'https://images.unsplash.com/photo-1558584673-650e95fef616?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGFydGlzdCUyMGFsYnVtfGVufDB8fDB8fHww',
      artist_id: 4,
      songs_count: 12,
      genres_count: 1,
      total_duration: 2700,
      release_date: new Date('2023-08-01'),
      is_active: false,
      is_featured: false,
      album_type: 'Album',
      created_at: new Date('2023-08-01T14:00:00Z'),
    },
    {
      name: 'City Lights',
      description: 'A vibrant pop single with infectious hooks.',
      image: 'https://images.unsplash.com/photo-1583927109257-f21c74dd0c3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFydGlzdCUyMGFsYnVtfGVufDB8fDB8fHww',
      artist_id: 5,
      songs_count: 1,
      genres_count: 1,
      total_duration: 210,
      release_date: new Date('2024-06-10'),
      is_active: true,
      is_featured: true,
      album_type: 'Single',
      created_at: new Date('2024-06-10T11:00:00Z'),
    },
  ];

  const createdAlbums = await prisma.$transaction(
    albumsData.map((albumData) =>
      prisma.albums.create({
        data: albumData,
      })
    )
  );

  console.log(`Seeded ${createdAlbums.length} albums`);
}