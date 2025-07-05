import prisma from '../lib/prisma.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';
import { ApiError } from '../lib/api_error.js';
import { BAD_REQUEST_STATUS } from '../lib/status_codes.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';

// Helper to truncate dates in JavaScript
const truncateDate = (date, group_by) => {
  const d = new Date(date);
  switch (group_by) {
    case 'day':
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split('T')[0];
    case 'week':
      const firstDayOfWeek = d.getDate() - d.getDay();
      return new Date(d.getFullYear(), d.getMonth(), firstDayOfWeek).toISOString().split('T')[0];
    case 'month':
      return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
    default:
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split('T')[0];
  }
};

// Group data by truncated date
const groupByDate = (items, dateField, group_by) => {
  const grouped = items.reduce((acc, item) => {
    const date = truncateDate(item[dateField], group_by);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(grouped).map(([date, value]) => ({
    date,
    value,
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const getSongPlaysAnalytics = async ({ start_date, end_date, group_by = 'day', genre_id, artist_id }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      // Validate inputs
      const where = {
        played_at: {
          gte: start_date ? new Date(start_date) : new Date('1970-01-01'),
          lte: end_date ? new Date(end_date) : new Date(),
        },
      };

      if (genre_id) {
        const genre = await prisma.genres.findUnique({ where: { id: parseInt(genre_id) } });
        if (!genre) throw new ApiError('Genre not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }
      if (artist_id) {
        const artist = await prisma.artists.findUnique({ where: { id: parseInt(artist_id) } });
        if (!artist) throw new ApiError('Artist not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      // Build song plays query
      const songPlaysWhere = {
        ...where,
        ...(artist_id && {
          song: { artist_id: parseInt(artist_id) },
        }),
        ...(genre_id && {
          song: {
            genre_id: genre_id
          },
        }),
      };

      // Fetch song plays for time series
      const songPlays = await prisma.song_plays.findMany({
        where: songPlaysWhere,
        include: {
          song: {
            include: {
              genre: true
            }
          },
        },
      });

      // Group by date
      const time_series = groupByDate(songPlays, 'played_at', group_by);

      // Fetch breakdown by genre and artist
      const [genres, artists] = await Promise.all([
        prisma.genres.findMany({
          select: {
            id: true,
            name: true,
            song_genre: {
              select: {
                song: {
                  select: {
                    song_plays: {
                      where,
                      select: { id: true },
                    },
                  },
                },
              },
            },
          },
        }),
        prisma.artists.findMany({
          select: {
            id: true,
            name: true,
            songs: {
              select: {
                song_plays: {
                  where,
                  select: { id: true },
                },
              },
            },
          },
        }),
      ]);

      const breakdown = {
        by_genre: genres.reduce((acc, g) => {
          acc[g.name] = g.song_genre.reduce((sum, sg) => sum + sg.song.song_plays.length, 0);
          return acc;
        }, {}),
        by_artist: artists.reduce((acc, a) => {
          acc[a.name] = a.songs.reduce((sum, s) => sum + s.song_plays.length, 0);
          return acc;
        }, {}),
      };

      const analytics = {
        time_series,
        breakdown,
      };

      return resolve(analytics);
    }
  )
);

export const getUserActivityAnalytics = async ({ start_date, end_date, group_by = 'day', activity_type }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const where = {
        gte: start_date ? new Date(start_date) : new Date('1970-01-01'),
        lte: end_date ? new Date(end_date) : new Date(),
      };

      let time_series = [];
      let breakdown = { by_gender: {}, by_user: {} };

      if (activity_type === 'signups') {
        const users = await prisma.users.findMany({
          where: {
            joined_at: where,
            deleted_at: null,
          },
          select: { joined_at: true },
        });
        time_series = groupByDate(users, 'joined_at', group_by);

        const genderBreakdown = await prisma.users.groupBy({
          by: ['gender'],
          where: { joined_at: where, deleted_at: null },
          _count: { id: true },
        });
        breakdown.by_gender = genderBreakdown.reduce((acc, g) => {
          acc[g.gender] = g._count.id;
          return acc;
        }, {});
      } else if (activity_type === 'logins') {
        const users = await prisma.users.findMany({
          where: {
            last_login_time: where,
            deleted_at: null,
          },
          select: { last_login_time: true },
        });
        time_series = groupByDate(users, 'last_login_time', group_by);

        const genderBreakdown = await prisma.users.groupBy({
          by: ['gender'],
          where: { last_login_time: where, deleted_at: null },
          _count: { id: true },
        });
        breakdown.by_gender = genderBreakdown.reduce((acc, g) => {
          acc[g.gender] = g._count.id;
          return acc;
        }, {});
      } else if (activity_type === 'playlist_creations') {
        const playlists = await prisma.user_playlists.findMany({
          where: { created_at: where },
          select: { created_at: true, user_id: true },
          include: { user: { select: { name: true } } },
        });
        time_series = groupByDate(playlists, 'created_at', group_by);

        const userBreakdown = await prisma.user_playlists.groupBy({
          by: ['user_id'],
          where: { created_at: where },
          _count: { id: true },
        });
        const userIds = userBreakdown.map(g => g.user_id);
        const users = await prisma.users.findMany({
          where: { id: { in: userIds }, deleted_at: null },
          select: { id: true, name: true },
        });
        breakdown.by_user = userBreakdown.reduce((acc, g) => {
          const user = users.find(u => u.id === g.user_id);
          acc[user?.name || 'Unknown'] = g._count.id;
          return acc;
        }, {});
      }

      const analytics = {
        time_series,
        breakdown,
      };

      return resolve(analytics);
    }
  )
);

export const getRetentionAnalytics = async ({ start_date, end_date, period = '30d' }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const where = {
        joined_at: {
          gte: start_date ? new Date(start_date) : new Date('1970-01-01'),
          lte: end_date ? new Date(end_date) : new Date(),
        },
        deleted_at: null,
      };

      const periodDays = period === '7d' ? 7 : period === '90d' ? 90 : 30;

      // Fetch users who signed up in the period
      const users = await prisma.users.findMany({
        where,
        select: { id: true, joined_at: true, last_login_time: true },
      });

      // Group by month
      const groupedByMonth = users.reduce((acc, user) => {
        const month = truncateDate(user.joined_at, 'month');
        if (!acc[month]) {
          acc[month] = { signed_up: 0, retained: 0 };
        }
        acc[month].signed_up += 1;
        if (
          user.last_login_time &&
          new Date(user.last_login_time) >= new Date(new Date(user.joined_at).setDate(user.joined_at.getDate() + periodDays))
        ) {
          acc[month].retained += 1;
        }
        return acc;
      }, {});

      // Convert to time series and breakdown
      const time_series = Object.entries(groupedByMonth).map(([date, data]) => ({
        date,
        value: data.signed_up > 0 ? ((data.retained / data.signed_up) * 100).toFixed(2) : 0,
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      const breakdown = Object.entries(groupedByMonth).reduce((acc, [date, data]) => {
        acc[date] = {
          signed_up: data.signed_up,
          retained: data.retained,
          retention_rate: data.signed_up > 0 ? ((data.retained / data.signed_up) * 100).toFixed(2) : 0,
        };
        return acc;
      }, {});

      const analytics = {
        time_series,
        breakdown,
      };

      return resolve(analytics);
    }
  )
);