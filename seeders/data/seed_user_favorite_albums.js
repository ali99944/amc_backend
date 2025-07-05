/**
 * Seeds user favorite albums into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} users - Array of created users
 * @param {Array} albums - Array of created albums
 * @returns {Promise<void>}
 */
export async function seedUserFavoriteAlbums(prisma, users, albums) {
    const favoriteAlbums = await prisma.user_favorite_albums.createMany({
      data: [
        { user_id: users[0].id, album_id: albums[0].id }, // Emma - Dawn FM
        { user_id: users[1].id, album_id: albums[2].id }, // Liam - Hollywood's Bleeding
        { user_id: users[2].id, album_id: albums[4].id }, // Sophia - Funk Wav Bounces Vol. 1
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${favoriteAlbums.count} user favorite albums`);
  }