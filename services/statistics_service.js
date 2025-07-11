// statistics_service.js
import prisma from '../lib/prisma.js';
import asyncWrapper from '../lib/wrappers/async_wrapper.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';

export const getOverviewStatistics = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const users_count = await prisma.users.count()
            const available_songs_count = await prisma.songs.count()
            const playlists_count = await prisma.users.count()
            const listen_time_count = 0

            const stats = {
                users_count,
                available_songs_count,
                playlists_count,
                listen_time_count
            }

            return resolve(stats);
        }
    )
);


export const getEngagementStatistics = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const data = {
                listen_hours_count: 1,
                average_session_time: 11,
                daily_active_users: 19
            }
        }
    )
)

export const getContentStatistics = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const data = {
                listen_hours_count: 1,
                average_session_time: 11,
                daily_active_users: 19
            }
        }
    )
)