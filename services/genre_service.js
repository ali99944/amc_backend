import { getCurrentDate } from "../lib/date.js";
import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";

export const getAllGenres = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const genres = await prisma.genres.findMany({})

            return resolve(genres)
        }
    )
)

export const createGenre = async ({ name, image }) => new Promise(
    async (resolve) => {
        const genre = await prisma.genres.create({
            data: {
                name: name,
                image: image,
                created_at: getCurrentDate()
            }
        })

        return resolve(genre)
    }
)

export const deleteGenre = async (id) => new Promise(
    async (resolve) => {
        const genre = await prisma.genres.delete({
            where: {
                id: +id
            }
        })

        return resolve(genre)
    }
)

export const updateGenre = async ({
    id, payload
}) => new Promise(
    async (resolve) => {
        const genre = await prisma.genres.update({
            where: {
                id: +id
            },  
            data: {
                name: payload.name,
                image: payload.image ?? undefined,
                updated_at: getCurrentDate()
            }
        })

        return resolve(genre)
    }
)