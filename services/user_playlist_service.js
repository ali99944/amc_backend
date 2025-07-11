// user_playlist_service.js
import prisma from '../lib/prisma.js';
import promiseAsyncWrapper from '../lib/wrappers/promise_async_wrapper.js';
import { ApiError } from '../lib/api_error.js';
import { BAD_REQUEST_STATUS } from '../lib/status_codes.js';
import { BAD_REQUEST_CODE } from '../lib/error_codes.js';

export const getUserPlaylists = async (user_id) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const playlists = await prisma.user_playlists.findMany({
        where: { user_id: +user_id },
        include: {
          songs: {
            include: {
              song: {
                include: {
                  artist: true,
                  original_audio: true,
                  genre: true,

                }
              },
            },
          },
        },
      });
      

      const mappedPlaylists = playlists.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        image: playlist.image,
        songs_count: playlist.songs.length,
        created_at: playlist.created_at.toISOString(),
        songs: playlist.songs
      }));

      

      return resolve(mappedPlaylists);
    }
  )
);

export const createUserPlaylist = async ({ name, description, image, user_id, song_ids }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      // Validate song IDs exist
      if (song_ids.length > 0) {
        const songs = await prisma.songs.findMany({ where: { id: { in: song_ids.map(id => +id) } } });
        if (songs.length !== song_ids.length) {
          throw new ApiError('One or more songs not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
        }
      }

      const playlist = await prisma.user_playlists.create({
        data: {
          name,
          description,
          image,
          user_id: +user_id,
          songs: {
            create: song_ids.map(song_id => ({
              song_id: +song_id,
            })),
          },
        },
        include: {
          songs: {
            include: {
              song: {
                include: {
                  artist: true,
                  original_audio: true,
                  genre: true,

                }
              },
            },
          },
        },
      });

      const mappedPlaylist = {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        image: playlist.image,
        user_id: playlist.user_id,
        songs_count: playlist.songs.length,
        created_at: playlist.created_at.toISOString(),
        songs: playlist.songs
        
      };

      return resolve(mappedPlaylist);
    }
  )
);

export const renameUserPlaylist = async ({ id, name, user_id }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const playlist = await prisma.user_playlists.findUnique({
        where: { id: +id },
        include: { songs: { include: { song: true } } },
      });

      if (!playlist) {
        throw new ApiError('Playlist not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      if (playlist.user_id !== +user_id) {
        throw new ApiError('Unauthorized to modify this playlist', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      const updatedPlaylist = await prisma.user_playlists.update({
        where: { id: +id },
        data: { name },
        include: { songs: { include: { song: true } } },
      });

      const mappedPlaylist = {
        id: updatedPlaylist.id,
        name: updatedPlaylist.name,
        description: updatedPlaylist.description,
        image: updatedPlaylist.image,
        user_id: updatedPlaylist.user_id,
        songs_count: updatedPlaylist.songs.length,
        created_at: updatedPlaylist.created_at.toISOString(),
      };

      return resolve(mappedPlaylist);
    }
  )
);

export const addSongsToUserPlaylist = async ({ id, song_ids, user_id }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const playlist = await prisma.user_playlists.findUnique({
        where: { id: +id },
      });

      if (!playlist) {
        throw new ApiError('Playlist not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      if (playlist.user_id !== +user_id) {
        throw new ApiError('Unauthorized to modify this playlist', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      // Validate song IDs exist
      const songs = await prisma.songs.findMany({ where: { id: { in: song_ids.map(id => +id) } } });
      if (songs.length !== song_ids.length) {
        throw new ApiError('One or more songs not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      // Check for existing songs in playlist
      const existingSongs = await prisma.user_playlist_song.findMany({
        where: {
          user_playlist_id: +id,
          song_id: { in: song_ids.map(id => +id) },
        },
      });

      const newSongIds = song_ids.filter(song_id => !existingSongs.some(es => es.song_id === +song_id));

      if (newSongIds.length === 0) {
        throw new ApiError('All songs already in playlist', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      await prisma.user_playlist_song.createMany({
        data: newSongIds.map(song_id => ({
          user_playlist_id: +id,
          song_id: +song_id,
        })),
      });

      const updatedPlaylist = await prisma.user_playlists.findUnique({
        where: { id: +id },
        include: { songs: { include: { song: true } } },
      });

      const mappedPlaylist = {
        id: updatedPlaylist.id,
        name: updatedPlaylist.name,
        description: updatedPlaylist.description,
        image: updatedPlaylist.image,
        user_id: updatedPlaylist.user_id,
        songs_count: updatedPlaylist.songs.length,
        created_at: updatedPlaylist.created_at.toISOString(),
      };

      return resolve(mappedPlaylist);
    }
  )
);

export const copySystemPlaylist = async ({ system_playlist_id, user_id }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const systemPlaylist = await prisma.playlists.findUnique({
        where: { id: +system_playlist_id, is_system: true },
        include: { songs: { include: { song: true } } },
      });

      if (!systemPlaylist) {
        throw new ApiError('System playlist not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      const playlist = await prisma.user_playlists.create({
        data: {
          name: `${systemPlaylist.name} (Copy)`,
          description: systemPlaylist.description,
          image: systemPlaylist.image,
          user_id: +user_id,
          songs: {
            create: systemPlaylist.songs.map(song => ({
              song_id: song.song_id,
            })),
          },
        },
        include: { songs: { include: { song: true } } },
      });

      const mappedPlaylist = {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        image: playlist.image,
        user_id: playlist.user_id,
        songs_count: playlist.songs.length,
        created_at: playlist.created_at.toISOString(),
      };

      return resolve(mappedPlaylist);
    }
  )
);

export const deleteUserPlaylist = async ({ id, user_id }) => new Promise(
  promiseAsyncWrapper(
    async (resolve) => {
      const playlist = await prisma.user_playlists.findUnique({
        where: { id: +id },
      });

      if (!playlist) {
        throw new ApiError('Playlist not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      if (playlist.user_id !== +user_id) {
        throw new ApiError('Unauthorized to delete this playlist', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
      }

      await prisma.user_playlists.delete({
        where: { id: +id },
      });

      return resolve();
    }
  )
);