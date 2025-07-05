/**
 * Seeds user playlists into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} users - Array of created users
 * @returns {Promise<void>}
 */
export async function seedUserPlaylists(prisma, users) {
    const userPlaylists = await prisma.user_playlists.createMany({
      data: [
        {
          name: 'Emma’s Favorites',
          description: 'Emma’s top picks',
          image: 'https://img.freepik.com/free-vector/gradient-playlist-cover-template_23-2150631414.jpg',
          user_id: users[0].id,
        },
        {
          name: 'Liam’s Road Trip Mix',
          description: 'Songs for the open road',
          image: 'https://img.freepik.com/free-vector/gradient-playlist-cover-template_23-2150631415.jpg',
          user_id: users[1].id,
        },
        {
          name: 'Sophia’s Workout Jams',
          description: 'High-energy workout tracks',
          image: 'https://img.freepik.com/free-vector/gradient-playlist-cover-template_23-2150631416.jpg',
          user_id: users[2].id,
        },
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${userPlaylists.count} user playlists`);
  }