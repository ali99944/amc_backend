import { PrismaClient } from "@prisma/client";
import { generateTrackNumber } from "../../lib/random.js";

/**
 * Seeds songs into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} artists - Array of created artists
 * @returns {Promise<void>}
 */
export async function seedSongs(prisma, artists) {
    const songs = await prisma.songs.createMany({
      data: [
        {
          title: 'Blinding Lights',
          artist_id: artists[0].id,
          is_active: true,
          genre_id: 1,
          track_number: generateTrackNumber()
          
        },
        {
          title: 'Save Your Tears',
          artist_id: artists[0].id,
          is_active: true,
          genre_id: 1,
          track_number: generateTrackNumber()
        },
        {
          title: 'Bad Guy',
          artist_id: artists[1].id,
          is_active: true,
          genre_id: 1,
          track_number: generateTrackNumber()
        },
        {
          title: 'Circles',
          artist_id: artists[2].id,
          is_active: true,
          genre_id: 2,
          track_number: generateTrackNumber()
        },
        {
          title: 'Don’t Know Why',
          artist_id: artists[3].id,
          is_active: true,
          genre_id: 2,
          track_number: generateTrackNumber()
        },
        {
          title: 'One Right Now',
          artist_id: artists[2].id,
          is_active: true,
          genre_id: 2,
          track_number: generateTrackNumber()
        },
        {
          title: 'Slide',
          artist_id: artists[4].id,
          is_active: true,
          genre_id: 3,
          track_number: generateTrackNumber()
        },
        {
          title: 'Feels',
          artist_id: artists[4].id,
          is_active: true,
          genre_id: 3,
          track_number: generateTrackNumber()
        },
        {
          title: 'Everything I Wanted',
          artist_id: artists[1].id,
          is_active: true,
          genre_id: 3,
          track_number: generateTrackNumber()
        },
        {
          title: 'Come Away With Me',
          artist_id: artists[3].id,
          is_active: true,
          genre_id: 4,
          track_number: generateTrackNumber()
        },
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${songs.count} songs`);
  }