/**
 * Seeds user artist interests into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} users - Array of created users
 * @param {Array} artists - Array of created artists
 * @returns {Promise<void>}
 */
export async function seedUserArtistInterests(prisma, users, artists) {
    const artistInterests = await prisma.user_artist_interests.createMany({
      data: [
        { user_id: users[0].id, artist_id: artists[0].id }, // Emma - The Weeknd
        { user_id: users[0].id, artist_id: artists[1].id }, // Emma - Billie Eilish
        { user_id: users[1].id, artist_id: artists[2].id }, // Liam - Post Malone
        { user_id: users[2].id, artist_id: artists[4].id }, // Sophia - Calvin Harris
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${artistInterests.count} user artist interests`);
  }