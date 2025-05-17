import { getCurrentDate } from "../../lib/date"
import prisma from "../../lib/prisma"

interface Artist {
    name: string
    bio: string
    image: string
}

const artists: Artist[] = [
    {
        name: 'Hindi',
        bio: '',
        image: '/assets/1.jfif'
    },
    {
        name: 'English',
        bio: '',
        image: '/assets/2.jfif'
    },
    {
        name: 'Punjabi',
        bio: '',
        image: '/assets/3.jfif'
    },
    {
        name: 'Tamil',
        bio: '',
        image: '/assets/4.jfif'
    },
    {
        name: 'Telgu',
        bio: '',
        image: '/assets/5.jfif'
    },
    {
        name: 'Malyalam',
        bio: '',
        image: '/assets/6.jfif'
    },
    {
        name: 'Marathi',
        bio: '',
        image: '/assets/7.jfif'
    },
    {
        name: 'Gujrati',
        bio: '',
        image: '/assets/8.jfif'
    },
    {
        name: 'Bengali',
        bio: '',
        image: '/assets/9.jfif'
    },
    {
        name: 'Kannada',
        bio: '',
        image: '/assets/10.jfif'
    }
]

export async function seed_artists() {
    await prisma.artists.deleteMany()


    await Promise.all(
        artists.map(async (artist) => {
            await prisma.artists.create({
                data: {
                    name: artist.name,
                    image: artist.image,
                    bio: artist.bio,
                }
            })
        })
    )
}
