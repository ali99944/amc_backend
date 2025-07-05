// statistics_service.js
import prisma from '../lib/prisma.js';
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