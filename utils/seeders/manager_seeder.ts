import prisma from "../../lib/prisma"

interface Manager {
    name: string
    username: string
    password: string

    role: 'admin' | 'super_admin'
}

const managers: Manager[] = [
    {
        name: 'ali',
        username: 'ali',
        password: 'ali',
        role: 'super_admin'
    },
    {
        name: 'test',
        username: 'test',
        password: 'test',
        role: 'admin'
    }
]

export async function seed_managers() {
    await prisma.managers.deleteMany()


    await prisma.managers.createMany({
        data: managers
    })
}
