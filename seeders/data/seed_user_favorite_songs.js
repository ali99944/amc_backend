/**
 * Seeds user favorite songs into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} users - Array of created users
 * @param {Array} songs - Array of created songs
 * @returns {Promise<void>}
 */
export async function seedUserFavoriteSongs(prisma, users, songs) {
    const favoriteSongs = await prisma.user_favorite_songs.createMany({
      data: [
        { user_id: users[0].id, song_id: songs[0].id }, // Emma - Blinding Lights
        { user_id: users[0].id, song_id: songs[2].id }, // Emma - Bad Guy
        { user_id: users[1].id, song_id: songs[3].id }, // Liam - Circles
        { user_id: users[2].id, song_id: songs[6].id }, // Sophia - Slide
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${favoriteSongs.count} user favorite songs`);
  }