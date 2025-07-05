import { PrismaClient } from "@prisma/client";

/**
 * Seeds genres into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @returns {Promise<void>}
 */
export async function seedGenres(prisma) {
    const genres = await prisma.genres.createMany({
      data: [
        {
          id: 1,
          name: 'Pop',
          total_songs: 0,
          image: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150631401.jpg',
        },
        {
          id: 2,
          name: 'Rock',
          total_songs: 0,
          image: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150631402.jpg',
        },
        {
          id: 3,
          name: 'Jazz',
          total_songs: 0,
          image: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150631403.jpg',
        },
        {
          id: 4,
          name: 'Hip-Hop',
          total_songs: 0,
          image: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150631404.jpg',
        },
        {
          id: 5,
          name: 'Electronic',
          total_songs: 0,
          image: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150631405.jpg',
        },
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${genres.count} genres`);
  }