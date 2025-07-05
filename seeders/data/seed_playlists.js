/**
 * Seeds system playlists into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @returns {Promise<void>}
 */
export async function seedPlaylists(prisma) {
    const playlists = await prisma.playlists.createMany({
      data: [
        {
          name: 'Pop Hits 2025',
          description: 'Top pop songs of the year',
          image: 'https://img.freepik.com/free-vector/gradient-playlist-cover-template_23-2150631411.jpg',
        },
        {
          name: 'Chill Jazz Vibes',
          description: 'Relax with smooth jazz',
          image: 'https://img.freepik.com/free-vector/gradient-playlist-cover-template_23-2150631412.jpg',
        },
        {
          name: 'Electronic Dance Party',
          description: 'Get moving with EDM',
          image: 'https://img.freepik.com/free-vector/gradient-playlist-cover-template_23-2150631413.jpg',
        },
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${playlists.count} system playlists`);
  }