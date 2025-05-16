import prisma from "../lib/prisma.js";
import { OK } from "../lib/status_codes.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";

export const getOverviewController = asyncWrapper(
    async (_, res) => {
        const total_songs = await prisma.songs.count()
        const total_artists = await prisma.artists.count()
        // const total_albums = await prisma.albums.count()
        const total_users = await prisma.users.count()
        const total_playlists = await prisma.playlists.count()
        const total_listens = await prisma.songs.aggregate({
            _sum: {
                total_plays: true
            }
        })

        return res.status(OK).json({ 
            total_songs, 
            total_artists, 
            // total_albums, 
            total_users, 
            total_playlists, 
            total_listens: total_listens._sum.total_plays ?? 0
        })
    }
)

export const getTopSongsController = asyncWrapper(
    async (_, res) => {
        const top_songs = await prisma.songs.findMany({
            orderBy: {
                total_plays: 'desc'
            },
            take: 10,
            include: {
                genre: true,
                artist: true,
                // album: true
            }
        })

        return res.status(OK).json(top_songs)
    }
)

export const getRecentUsersController = asyncWrapper(
    async (_, res) => {
        const recent_users = await prisma.users.findMany({
            orderBy: {
                joined_at: 'desc'
            },
            take: 10
        })

        return res.status(OK).json(recent_users)
    }
)