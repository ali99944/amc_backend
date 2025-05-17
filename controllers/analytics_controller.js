import prisma from "../lib/prisma.js"
import { OK_STATUS } from "../lib/status_codes.js"
import asyncWrapper from "../lib/wrappers/async_wrapper.js"

import moment from "moment"

export const getUserGrowthController = asyncWrapper(
    async (_, res) => {
        const users = await prisma.users.findMany({
            select: {
                joined_at: true
            }
        })

        const formattedUsers = users.map(user => ({
            date: moment(user.joined_at).format('YYYY-MM')
        }))

        const userGrowth = formattedUsers.reduce((prev, current) => {
            const date = current.date
            const count = prev[date] ? prev[date].count + 1 : 1
            return {
                ...prev,
                [date]: { date, count }
            }
        }, {})

        const data = Object.values(userGrowth)

        return res.status(OK_STATUS).json(data)
    }
)

export const getSongsCategorizedByGenreController = asyncWrapper(
    async (_, res) => {
        const songsCategorizedByGenre = await prisma.songs.groupBy({
            by: ['genre_id'],
            _count: {
                genre_id: true
            }
        })

        return res.status(OK_STATUS).json(songsCategorizedByGenre)
    }
)
