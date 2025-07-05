import { PrismaClient } from "@prisma/client";

/**
 * Seeds songs into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} artists - Array of created artists
 * @param {Array} albums - Array of created albums
 * @returns {Promise<void>}
 */
export async function seedSongs(prisma, artists, albums) {
    const songs = await prisma.songs.createMany({
      data: [
        {
          title: 'Blinding Lights',
          artist_id: artists[0].id,
          is_active: true,
          genre_id: 1
          
        },
        {
          title: 'Save Your Tears',
          artist_id: artists[0].id,
          is_active: true,
          genre_id: 1
        },
        {
          title: 'Bad Guy',
          artist_id: artists[1].id,
          is_active: true,
          genre_id: 1
        },
        {
          title: 'Circles',
          artist_id: artists[2].id,
          is_active: true,
          genre_id: 2
        },
        {
          title: 'Don’t Know Why',
          artist_id: artists[3].id,
          is_active: true,
          genre_id: 2
        },
        {
          title: 'One Right Now',
          artist_id: artists[2].id,
          is_active: true,
          genre_id: 2
        },
        {
          title: 'Slide',
          artist_id: artists[4].id,
          is_active: true,
          genre_id: 3
        },
        {
          title: 'Feels',
          artist_id: artists[4].id,
          is_active: true,
          genre_id: 3
        },
        {
          title: 'Everything I Wanted',
          artist_id: artists[1].id,
          is_active: true,
          genre_id: 3
        },
        {
          title: 'Come Away With Me',
          artist_id: artists[3].id,
          is_active: true,
          genre_id: 4
        },
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${songs.count} songs`);
  }