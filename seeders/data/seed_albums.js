/**
 * Seeds albums into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Array} artists - Array of created artists
 * @returns {Promise<void>}
 */
export async function seedAlbums(prisma, artists) {
    const albums = await prisma.albums.createMany({
      data: [
        {
          title: 'Dawn FM',
          artist_id: artists[0].id,
          cover: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150631406.jpg',
          release_date: new Date('2022-01-07'),
        },
        {
          title: 'Happier Than Ever',
          artist_id: artists[1].id,
          cover: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150631407.jpg',
          release_date: new Date('2021-07-30'),
        },
        {
          title: "Hollywood's Bleeding",
          artist_id: artists[2].id,
          cover: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150631408.jpg',
          release_date: new Date('2019-09-06'),
        },
        {
          title: 'Come Away With Me',
          artist_id: artists[3].id,
          cover: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150631409.jpg',
          release_date: new Date('2002-02-26'),
        },
        {
          title: 'Funk Wav Bounces Vol. 1',
          artist_id: artists[4].id,
          cover: 'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150631410.jpg',
          release_date: new Date('2017-06-30'),
        },
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${albums.count} albums`);
  }