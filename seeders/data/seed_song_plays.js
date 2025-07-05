/**
 * Seeds song plays into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} users - Array of created users
 * @param {Array} songs - Array of created songs
 * @returns {Promise<void>}
 */
export async function seedSongPlays(prisma, users, songs) {
    const songPlays = await prisma.song_plays.createMany({
      data: [
        { user_id: users[0].id, song_id: songs[0].id, played_at: new Date('2025-06-10T10:00:00Z') }, // Emma - Blinding Lights
        { user_id: users[0].id, song_id: songs[2].id, played_at: new Date('2025-06-11T11:00:00Z') }, // Emma - Bad Guy
        { user_id: users[0].id, song_id: songs[0].id, played_at: new Date('2025-06-12T12:00:00Z') }, // Emma - Blinding Lights
        { user_id: users[1].id, song_id: songs[3].id, played_at: new Date('2025-06-09T12:00:00Z') }, // Liam - Circles
        { user_id: users[1].id, song_id: songs[5].id, played_at: new Date('2025-06-10T13:00:00Z') }, // Liam - One Right Now
        { user_id: users[1].id, song_id: songs[3].id, played_at: new Date('2025-06-11T14:00:00Z') }, // Liam - Circles
        { user_id: users[2].id, song_id: songs[6].id, played_at: new Date('2025-06-08T14:00:00Z') }, // Sophia - Slide
        { user_id: users[2].id, song_id: songs[7].id, played_at: new Date('2025-06-09T15:00:00Z') }, // Sophia - Feels
        { user_id: users[3].id, song_id: songs[4].id, played_at: new Date('2025-05-15T16:00:00Z') }, // Noah - Don’t Know Why
        { user_id: users[4].id, song_id: songs[9].id, played_at: new Date('2025-05-20T17:00:00Z') }, // Ava - Come Away With Me
        { user_id: users[0].id, song_id: songs[8].id, played_at: new Date('2025-06-13T09:00:00Z') }, // Emma - Everything I Wanted
        { user_id: users[1].id, song_id: songs[1].id, played_at: new Date('2025-06-12T10:00:00Z') }, // Liam - Save Your Tears
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${songPlays.count} song plays`);
  }