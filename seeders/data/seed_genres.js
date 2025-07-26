import prisma from "../../lib/prisma.js";

export async function seedGenres() {
    const genres = [
        {
            name: 'Pop',
            description: 'Pop music is a genre of popular music that originated in its modern form in the 1950s, deriving from rock and roll.',
            image: 'system/genres/1.jfif',
            color: '#FF69B4',
        },
        {
            name: 'Rock',
            description: 'Rock music is a genre of popular music that originated as "rock and roll" in the United States in the 1950s, and developed into a diverse range of styles in the 1960s and later.',
            image: 'system/genres/2.jfif',
            color: '#E2786F',
        },
        {
            name: 'Hip-Hop/Rap',
            description: 'Hip hop music, also known as rap music, is a genre of popular music developed in the United States by African Americans and Latino Americans in the 1970s.',
            image: 'system/genres/3.jfif',
            color: '#6495ED',
        },
        {
            name: 'Electronic',
            description: 'Electronic music is a broad range of electronic music styles intended for listening rather than for dancing.',
            image: 'system/genres/4.jfif',
            color: '#2ECC71',
        },
        {
            name: 'Classical',
            description: 'Classical music is a broad term that refers to music produced in, or rooted in the traditions of, Western classical music, including both liturgical and secular music.',
            image: 'system/genres/5.jfif',
            color: '#F7DC6F',
        },
        {
            name: 'Jazz',
            description: 'Jazz is a genre of music that originated in the African-American communities of New Orleans, Louisiana, in the late 19th and early 20th centuries.',
            image: 'system/genres/6.jfif',
            color: '#FFC107',
        },
        {
            name: 'Reggae',
            description: 'Reggae is a music genre that originated in Jamaica in the late 1960s, characterized by a strong rhythm and socially conscious lyrics.',
            image: 'system/genres/7.jfif',
            color: '#00B894',
        },
        {
            name: 'Country',
            description: 'Country music is a genre of popular music that originated with blues, old-time music, and various types of American folk music.',
            image: 'system/genres/8.jfif',
            color: '#D35400',
        },
        {
            name: 'Blues',
            description: 'Blues is a music genre and musical form which was originated in the Deep South of the United States around the 1860s.',
            image: 'system/genres/9.jfif',
            color: '#34495E',
        },
        {
            name: 'R&B',
            description: 'Rhythm and blues, often abbreviated as R&B, is a genre of popular music that originated in African-American communities in the 1940s.',
            image: 'system/genres/10.jfif',
            color: '#8E44AD',
        },
        {
            name: 'Folk',
            description: 'Folk music is a music genre that includes traditional folk music and the contemporary genre that evolved from the former during the 20th-century folk revival.',
            image: 'system/genres/11.jfif',
            color: '#27AE60',
        },
        // Additional 11 genres
        {
            name: 'Soul',
            description: 'Soul music is a genre that combines elements of African-American gospel music, rhythm and blues, and jazz.',
            image: 'system/genres/1.jfif',
            color: '#FFB300',
        },
        {
            name: 'Metal',
            description: 'Metal is a genre of rock music that developed in the late 1960s and early 1970s, known for its amplified distortion and aggressive sound.',
            image: 'system/genres/2.jfif',
            color: '#616161',
        },
        {
            name: 'Disco',
            description: 'Disco is a genre of dance music containing elements of funk, soul, pop, and salsa, popular in the 1970s.',
            image: 'system/genres/3.jfif',
            color: '#FF4081',
        },
        {
            name: 'Alternative',
            description: 'Alternative music is a genre that emerged from the independent music underground of the 1980s and became widely popular in the 1990s.',
            image: 'system/genres/4.jfif',
            color: '#00B8D4',
        },
        {
            name: 'Latin',
            description: 'Latin music is a genre that encompasses music from Latin America and the Iberian Peninsula.',
            image: 'system/genres/5.jfif',
            color: '#FF5252',
        },
        {
            name: 'K-Pop',
            description: 'K-Pop is a genre of popular music originating in South Korea, characterized by a wide variety of audiovisual elements.',
            image: 'system/genres/6.jfif',
            color: '#E040FB',
        },
        {
            name: 'Gospel',
            description: 'Gospel music is a genre of Christian music characterized by dominant vocals and Christian lyrics.',
            image: 'system/genres/7.jfif',
            color: '#FFD600',
        },
        {
            name: 'Dance',
            description: 'Dance music is music composed specifically to facilitate or accompany dancing.',
            image: 'system/genres/8.jfif',
            color: '#00E676',
        },
        {
            name: 'Indie',
            description: 'Indie music is a genre of music that is produced independently from commercial record labels.',
            image: 'system/genres/9.jfif',
            color: '#A1887F',
        },
        {
            name: 'World',
            description: 'World music is a musical category encompassing many different styles of music from around the globe.',
            image: 'system/genres/10.jfif',
            color: '#0097A7',
        },
        {
            name: 'Soundtrack',
            description: 'Soundtrack music is recorded music accompanying and synchronized to the images of a motion picture, television program, or video game.',
            image: 'system/genres/11.jfif',
            color: '#C51162',
        },
    ];

    // Create genres in a transaction
    const createdGenres = await prisma.genres.createMany({
        data: genres,
        skipDuplicates: true,
    });

    console.log(`Seeded ${createdGenres.count} genres`);
}
