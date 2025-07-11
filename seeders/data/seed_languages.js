import prisma from '../../lib/prisma.js';

export async function seedLanguages() {
  const languages = [
    {
      name: "العربية",
      code: "ar"
    },

    {
        name: "english",
        code: "en"
    }
];

  // Create users and their settings in a transaction
  const createdLanguages = await prisma.$transaction(
    languages.map((language) =>
      prisma.languages.create({
        data: {
          ...language,
        },
      })
    )
  );

  console.log(`Seeded ${createdLanguages.length} users with settings`);
}