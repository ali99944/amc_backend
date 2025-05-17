import prisma from "../lib/prisma.js"
import { NOT_FOUND_STATUS, OK_STATUS } from "../lib/status_codes.js"
import asyncWrapper from "../lib/wrappers/async_wrapper.js"
import CustomError from "../utils/custom_error.js"

export const getAllArtistsController = asyncWrapper(
    async (req, res) => {
        const artists = await prisma.artists.findMany({
            include: {
                songs: true,
                // albums: true,
                followers: true,
                genres: true
            }
        })

        return res.status(OK_STATUS).json(artists)
    }
)

export const getArtistController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const artist = await prisma.artists.findUnique({
            where: {
                id: +id
            },
            include: {
                songs: true,
                // albums: true,
                followers: true,
                genres: true
            }
        })

        if(!artist) {
            const not_found_error = new CustomError("Artist not found", NOT_FOUND_STATUS)
            return next(not_found_error)
        }

        return res.status(OK_STATUS).json(artist)
    }
)

export const createArtistController = asyncWrapper(
    async (req, res) => {
        const { name, image, bio, genres } = req.body

        await Validator.validateNotNull({ name, image, bio })
        await Validator.isArray(genres)

        const artist = await prisma.artists.create({
            data: {
                name,
                image,
                bio,
                genres: {
                    createMany: {
                        data: genres.map(genre_id => ({ genre_id: +genre_id }))
                    }
                }
            }
        })

        return res.status(OK_STATUS).json(artist)
    }
)

export const updateArtistController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { name, image, bio, genres } = req.body

        await Validator.validateNotNull({ name, image, bio })
        await Validator.isArray(genres)

        const artist = await prisma.artists.update({
            where: {
                id: +id
            },
            data: {
                name,
                image,
                bio,
                genres: {
                    deleteMany: {
                        artist_id: +id
                    },
                    createMany: {
                        data: genres.map(genre_id => ({ genre_id: +genre_id, artist_id: +id }))
                    }
                }
            }
        })

        return res.status(OK_STATUS).json(artist)
    }
)

export const deleteArtistController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        await prisma.artists.delete({
            where: {
                id: +id
            }
        })
        return res.status(OK_STATUS).json({ success: true })
    }
)

export const followArtistController = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params
        const { user_id } = req.body

        await Validator.validateNotNull({ id, user_id })

        const is_following = await prisma.artist_followers.findFirst({
            where: {
                artist_id: +id,
                user_id: +user_id
            }
        })

        if(is_following) {
            const already_following_error = new CustomError("You are already following this artist", BAD_REQUEST)
            return next(already_following_error)
        }

        await prisma.artist_followers.create({
            data: {
                artist_id: +id,
                user_id: +user_id
            }
        })

        return res.status(OK_STATUS).json({ success: true })
    }
)

export const unfollowArtistController = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params
        const { user_id } = req.body

        await Validator.validateNotNull({ id, user_id })

        const is_following = await prisma.artist_followers.findFirst({
            where: {
                artist_id: +id,
                user_id: +user_id
            }
        })

        if(!is_following) {
            const not_following_error = new CustomError("You are not following this artist", BAD_REQUEST)
            return next(not_following_error)
        }

        await prisma.artist_followers.delete({
            where: {
                id: is_following.id
            }
        })

        return res.status(OK_STATUS).json({ success: true })
    }
)
