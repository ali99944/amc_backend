/**
 * Seeds user genre interests into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} users - Array of created users
 * @param {Array} genres - Array of created genres
 * @returns {Promise<void>}
 */
export async function seedUserGenreInterests(prisma, users, genres) {
    const genreInterests = await prisma.user_genre_interests.createMany({
      data: [
        { user_id: users[0].id, genre_id: genres[0].id }, // Emma - Pop
        { user_id: users[0].id, genre_id: genres[2].id }, // Emma - Jazz
        { user_id: users[1].id, genre_id: genres[3].id }, // Liam - Hip-Hop
        { user_id: users[2].id, genre_id: genres[4].id }, // Sophia - Electronic
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${genreInterests.count} user genre interests`);
  }