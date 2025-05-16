import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";

export const getAllPlaylists = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const playlists = await prisma.playlists.findMany()
            return resolve(playlists)
        }
    )
)

export const createPlaylist = async ({ title, description, cover_image, is_public }) => new Promise(
    async (resolve, reject) => {
        const playlist = await prisma.playlists.create({
            data: {
                title, 
                description, 
                cover_image, 
                is_public
            }
        })
        return resolve(playlist)
    }
)

export const getPlaylist = async (id) => new Promise(
    async (resolve, reject) => {
        const playlist = await prisma.playlists.findUnique({
            where: {
                id: +id
            }
        })
        return resolve(playlist)
    }
)

export const updatePlaylist = async ({ id, payload }) => new Promise(
    async (resolve, reject) => {
        const playlist = await prisma.playlists.update({
            where: {
                id: +id
            },
            data: payload
        })
        return resolve(playlist)
    }
)

export const deletePlaylist = async (id) => new Promise(
    async (resolve, reject) => {
        await prisma.playlists.delete({
            where: {
                id: +id
            }
        })
        return resolve(true)
    }
)
