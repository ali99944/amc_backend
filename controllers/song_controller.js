import prisma from "../lib/prisma.js"
import { OK_STATUS } from "../lib/status_codes.js"
import Validator from "../lib/validator.js"
import asyncWrapper from "../lib/wrappers/async_wrapper.js"

export const getAllSongsController = asyncWrapper(
    async (req, res) => {
        const songs = await prisma.songs.findMany()
        return res.status(OK_STATUS).json(songs)
    }
)

export const createSongController = asyncWrapper(
    async (req, res) => {
        const { title, artist_id, genre_id, album_id, release_date } = req.body
        await Validator.validateNotNull({ title, genre_id, artist_id, release_date })
        

        const song = await prisma.songs.create({
            data: {
                title,
                genre_id: +genre_id,
                artist_id: +artist_id,
                album_id: +album_id,
                release_date
            }
        })

        return res.status(OK_STATUS).json(song)
    }
)

export const updateSongController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { title, artist_id, genre_id, album_id, release_date } = req.body

        await Validator.validateNotNull({ title, genre_id, artist_id, release_date })

        const song = await prisma.songs.update({
            where: {
                id: +id
            },
            data: {
                title,
                genre_id: +genre_id,
                artist_id: +artist_id,
                album_id: +album_id,
                release_date
            }
        })

        return res.status(OK_STATUS).json(song)
    }
)

export const deleteSongController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        await prisma.songs.delete({
            where: {
                id: +id
            }
        })
        return res.status(OK_STATUS).json({ success: true })
    }
)

export const getArtistSongsController = asyncWrapper(
    async (req, res) => {
        const { id: artist_id } = req.params

        const artist_songs = await prisma.songs.findMany({
            where: {
                artist_id: +artist_id
            }
        })
        return res.status(OK_STATUS).json(artist_songs)
    }
)