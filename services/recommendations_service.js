// recommendations_service.js
import prisma from '../lib/prisma.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';
import { ApiError, BadRequestError } from '../lib/api_error.js';
import { BAD_REQUEST_STATUS } from '../lib/status_codes.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';

export const getSongRecommendations = async ({ user_id, limit, offset }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Get user's preferred genres and artists from play history
      const userPlays = await prisma.song_plays.findMany({
        where: { user_id: +user_id },
        include: {
          song: {
            include: {
              artist: true,
              album: true,
              song_genre: { include: { genre: true } },
            },
          },
        },
      });

      let recommendedSongs = [];

      if (userPlays.length > 0) {
        // Extract preferred genres and artists
        const genreIds = [...new Set(userPlays.flatMap(p => p.song.song_genre.map(g => g.genre_id)))];
        const artistIds = [...new Set(userPlays.map(p => p.song.artist_id))];

        // Find songs matching preferred genres/artists, excluding recently played
        const recentlyPlayedSongIds = userPlays
          .filter(p => p.played_at >= sevenDaysAgo)
          .map(p => p.song_id);

        recommendedSongs = await prisma.songs.findMany({
          where: {
            OR: [
              { song_genre: { some: { genre_id: { in: genreIds } } } },
              { artist_id: { in: artistIds } },
            ],
            id: { notIn: recentlyPlayedSongIds },
            is_active: true,
          },
          include: {
            artist: true,
            album: true,
            song_genre: { include: { genre: true } },
          },
          take: limit,
          skip: offset,
        });
      }

      // Fallback to popular songs if no play history or insufficient results
      if (recommendedSongs.length < limit) {
        const additionalLimit = limit - recommendedSongs.length;
        const popularSongs = await prisma.songs.findMany({
          where: {
            id: { notIn: [...recommendedSongs.map(s => s.id), ...userPlays.map(p => p.song_id)] },
            is_active: true,
          },
          include: {
            artist: true,
            album: true,
            song_genre: { include: { genre: true } },
          },
          orderBy: { song_plays: { _count: 'desc' } },
          take: additionalLimit,
          skip: offset,
        });
        recommendedSongs = [...recommendedSongs, ...popularSongs];
      }

      const mappedSongs = recommendedSongs.map(song => ({
        id: song.id.toString(),
        title: song.title,
        artist_id: song.artist_id.toString(),
        artist_name: song.artist.name,
        album_id: song.album_id.toString(),
        album_title: song.album.title,
        duration: song.duration,
        genre_ids: song.song_genre.map(sg => sg.genre_id.toString()),
        genre_names: song.song_genre.map(sg => sg.genre.name),
      }));

      return resolve(mappedSongs);
    }
  )
);

export const getPlaylistRecommendations = async ({ user_id, limit, offset }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      // Get user's preferred genres and artists from play history and user playlists
      const userData = await prisma.users.findUnique({
        where: { id: +user_id },
        include: {
          song_plays: {
            include: {
              song: {
                include: { song_genre: { include: { genre: true } }, artist: true },
              },
            },
          },
          user_playlists: {
            include: { songs: { include: { song: { include: { song_genre: true, artist: true } } } } },
          },
        },
      });

      if (!userData) {
        throw new BadRequestError('User not found');
      }

      let recommendedPlaylists = [];

      if (userData.song_plays.length > 0 || userData.user_playlists.length > 0) {
        // Extract preferred genres and artists
        const genreIds = [
          ...new Set([
            ...userData.song_plays.flatMap(p => p.song.song_genre.map(g => g.genre_id)),
            ...userData.user_playlists.flatMap(p => p.songs.flatMap(s => s.song.song_genre.map(g => g.genre_id))),
          ]),
        ];
        const artistIds = [
          ...new Set([
            ...userData.song_plays.map(p => p.song.artist_id),
            ...userData.user_playlists.flatMap(p => p.songs.map(s => s.song.artist_id)),
          ]),
        ];

        // Find system playlists with matching genres/artists
        const systemPlaylists = await prisma.playlists.findMany({
          where: {
            is_system: true,
            OR: [
              { songs: { some: { song: { song_genre: { some: { genre_id: { in: genreIds } } } } } } },
              { songs: { some: { song: { artist_id: { in: artistIds } } } } },
            ],
          },
          include: {
            songs: { include: { song: true } },
            user: true,
          },
          take: Math.ceil(limit / 2),
          skip: offset,
        });

        // Find user playlists from other users with matching genres/artists
        const userPlaylists = await prisma.user_playlists.findMany({
          where: {
            user_id: { not: +user_id }, // Exclude user's own playlists
            OR: [
              { songs: { some: { song: { song_genre: { some: { genre_id: { in: genreIds } } } } } } },
              { songs: { some: { song: { artist_id: { in: artistIds } } } } },
            ],
          },
          include: {
            songs: { include: { song: true } },
            user: true,
          },
          take: Math.ceil(limit / 2),
          skip: offset,
        });

        recommendedPlaylists = [...systemPlaylists, ...userPlaylists];
      }

      // Fallback to popular playlists if no recommendations or insufficient results
      if (recommendedPlaylists.length < limit) {
        const additionalLimit = limit - recommendedPlaylists.length;
        const popularPlaylists = await prisma.playlists.findMany({
          where: {
            is_system: true,
            id: { notIn: recommendedPlaylists.map(p => p.id) },
          },
          include: {
            songs: { include: { song: true } },
            user: true,
          },
          orderBy: { songs: { _count: 'desc' } },
          take: additionalLimit,
          skip: offset,
        });
        recommendedPlaylists = [...recommendedPlaylists, ...popularPlaylists];
      }

      const mappedPlaylists = recommendedPlaylists.map(playlist => ({
        id: playlist.id.toString(),
        name: playlist.name,
        description: playlist.description,
        image: playlist.image,
        is_system: playlist.is_system || false,
        songs_count: playlist.songs.length,
        user_id: playlist.user_id?.toString() || null,
        user_name: playlist.user?.name || null,
      }));

      return resolve(mappedPlaylists);
    }
  )
);