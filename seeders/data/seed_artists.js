/**
 * Seeds artists into the database.
 * @param {PrismaClient} prisma - Prisma client instance
 * @returns {Promise<void>}
 */
export async function seedArtists(prisma) {
    const artists = await prisma.artists.createMany({
      data: [
        {
          name: 'The Weeknd',
          bio: 'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer-songwriter and record producer. Known for his versatile vocal style and dark lyricism.',
          image: 'https://img.freepik.com/free-photo/portrait-male-artist-performing_23-2149084952.jpg',
        },
        {
          name: 'Billie Eilish',
          bio: "Billie Eilish Pirate Baird O'Connell is an American singer-songwriter. She first gained attention in 2015 with her debut single 'Ocean Eyes' and has since become one of the most successful artists of her generation.",
          image: 'https://img.freepik.com/free-photo/portrait-female-artist-performing_23-2149084953.jpg',
        },
        {
          name: 'Post Malone',
          bio: 'Austin Richard Post, known professionally as Post Malone, is an American rapper, singer, songwriter, and record producer. Known for his introspective songwriting and laconic vocal style.',
          image: 'https://img.freepik.com/free-photo/portrait-male-artist-performing_23-2149084954.jpg',
        },
        {
          name: 'Norah Jones',
          bio: 'Norah Jones is an American singer, songwriter, and pianist. Her unique blend of jazz, country, and pop has earned her multiple Grammy Awards and worldwide acclaim.',
          image: 'https://img.freepik.com/free-photo/portrait-female-artist-performing_23-2149084955.jpg',
        },
        {
          name: 'Calvin Harris',
          bio: 'Adam Richard Wiles, known professionally as Calvin Harris, is a Scottish DJ, record producer, singer, and songwriter. He is known for his electronic dance music and has collaborated with numerous high-profile artists.',
          image: 'https://img.freepik.com/free-photo/portrait-male-artist-performing_23-2149084956.jpg',
        },
      ],
      skipDuplicates: true,
    });
    console.log(`Seeded ${artists.count} artists`);
  }