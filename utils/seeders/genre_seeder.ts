import { getCurrentDate } from "../../lib/date"
import prisma from "../../lib/prisma"

interface Genre {
    name: string
    image: string
}

const genres: Genre[] = [
    {
        name: 'Hindi',
        image: '/assets/1.jfif'
    },
    {
        name: 'English',
        image: '/assets/2.jfif'
    },
    {
        name: 'Punjabi',
        image: '/assets/3.jfif'
    },
    {
        name: 'Tamil',
        image: '/assets/4.jfif'
    },
    {
        name: 'Telgu',
        image: '/assets/5.jfif'
    },
    {
        name: 'Malyalam',
        image: '/assets/6.jfif'
    },
    {
        name: 'Marathi',
        image: '/assets/7.jfif'
    },
    {
        name: 'Gujrati',
        image: '/assets/8.jfif'
    },
    {
        name: 'Bengali',
        image: '/assets/9.jfif'
    },
    {
        name: 'Kannada',
        image: '/assets/10.jfif'
    }
]

export async function seed_genres() {
    await prisma.genres.deleteMany()


    await Promise.all(
        genres.map(async (genre) => {
            await prisma.genres.create({
                data: {
                    name: genre.name,
                    image: genre.image,
                }
            })
        })
    )
}
