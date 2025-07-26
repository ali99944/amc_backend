import prisma from '../../lib/prisma.js';

export async function seedArtists() {
    const artistsData = [
        {
            name: 'Marawan Mousa',
            image: 'system/artists/marawan.png',
            bio: 'Egyptian rapper and songwriter, known for his unique blend of hip-hop and contemporary Egyptian sounds.',
            is_featured: true,
            is_active: true,
            created_at: new Date('2024-01-15T10:00:00Z'),
            followers_count: 125000,
        },
        {
            name: 'Afroto',
            image: 'system/artists/afroto.png',
            bio: 'Popular Egyptian rapper and singer, recognized for his melodic trap music and impactful lyrics.',
            is_featured: false,
            is_active: true,
            created_at: new Date('2024-03-20T12:00:00Z'),
            followers_count: 45000,
        },
        {
            name: 'Amir Mounir',
            image: 'system/artists/amir.png',
            bio: 'Egyptian artist and motivational speaker, known for his inspirational talks and social media presence.',
            is_featured: true,
            is_active: true,
            created_at: new Date('2023-11-10T09:00:00Z'),
            followers_count: 87000,
        },
        {
            name: '3nba',
            image: 'system/artists/3nba.png',
            bio: 'Sudanese rapper and music producer, celebrated for his energetic performances and creative beats.',
            is_featured: false,
            is_active: false,
            created_at: new Date('2023-06-05T14:00:00Z'),
            followers_count: 32000,
        },
        {
            name: 'Tones I',
            image: 'system/artists/tones.png',
            bio: 'Australian singer-songwriter best known for her global hit "Dance Monkey" and distinctive vocal style.',
            is_featured: true,
            is_active: true,
            created_at: new Date('2024-05-01T11:00:00Z'),
            followers_count: 98000,
        },
    ];

    const createdArtists = await prisma.$transaction(
        artistsData.map((artistData) =>
            prisma.artists.create({
                data: artistData,
            })
        )
    );

    console.log(`Seeded ${createdArtists.length} artists`);
}
