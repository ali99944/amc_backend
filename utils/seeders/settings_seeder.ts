import prisma from "../../lib/prisma"

interface Setting {
    key: string
    controls: Record<string, string>
}

const settings: Setting[] = [
    {
        key: 'data_saver',
        controls: {
            
        }
    },
    {
        key: 'payment_settings',
        controls: {

        }
    }
]


export async function seed_settings() {
    await prisma.settings.deleteMany()
    
    await prisma.settings.createMany({
        data: settings
    })
}
