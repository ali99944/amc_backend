// playlist_service.js
import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";
import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_STATUS } from "../lib/status_codes.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";

export const getAllPlaylists = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const playlists = await prisma.playlists.findMany({
                include: {
                    songs: true
                },
            });

            // Map to interface
            const mappedPlaylists = playlists.map(playlist => ({
                id: playlist.id,
                name: playlist.name,
                description: playlist.description,
                image: playlist.image,
                songs_count: playlist.songs.length,
                is_active: playlist.is_active,
                created_at: playlist.created_at.toISOString(),
            }));

            return resolve(mappedPlaylists);
        }
    )
);

export const createPlaylist = async ({ name, description, image, user_id, song_ids }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            // Verify user exists
            const user = await prisma.users.findUnique({ where: { id: user_id } });
            if (!user) {
                throw new ApiError("User not found", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            const playlist = await prisma.playlists.create({
                data: {
                    name,
                    description,
                    image,
                    user_id,
                    is_active: true,
                    songs: song_ids.length > 0 ? {
                        create: song_ids.map(id => ({
                            song_id: id,
                        })),
                    } : undefined,
                },
                include: {
                    songs: true
                },
            });

            // Map to interface
            const mappedPlaylist = {
                id: playlist.id,
                name: playlist.name,
                description: playlist.description,
                image: playlist.image,
                user_id: playlist.user_id,
                songs_count: playlist.songs.length,
                is_active: playlist.is_active,
                created_at: playlist.created_at.toISOString(),
            };

            return resolve(mappedPlaylist);
        }
    )
);

export const deletePlaylist = async (id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const playlist = await prisma.playlists.findUnique({
                where: { id: +id },
                include: { songs: true },
            });

            if (!playlist) {
                throw new ApiError("Playlist not found", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            // Delete playlist (cascades to playlist_song)
            const deletedPlaylist = await prisma.playlists.delete({
                where: { id: +id },
                include: { songs: true, user: true },
            });

            // Map to interface
            const mappedPlaylist = {
                id: deletedPlaylist.id,
                name: deletedPlaylist.name,
                description: deletedPlaylist.description,
                image: deletedPlaylist.image,
                user_id: deletedPlaylist.user_id,
                songs_count: deletedPlaylist.songs.length,
                is_active: deletedPlaylist.is_active,
                created_at: deletedPlaylist.created_at.toISOString(),
            };

            return resolve(mappedPlaylist);
        }
    )
);

export const updatePlaylist = async ({ id, payload }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const { name, description, image, user_id, song_ids, is_active } = payload;

            // Verify user exists if user_id is provided
            if (user_id) {
                const user = await prisma.users.findUnique({ where: { id: user_id } });
                if (!user) {
                    throw new ApiError("User not found", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
                }
            }

            // Handle song updates
            let songUpdate = {};
            if (song_ids) {
                // Delete existing song associations
                await prisma.playlist_song.deleteMany({
                    where: { playlist_id: +id },
                });

                // Create new song associations
                if (song_ids.length > 0) {
                    songUpdate = {
                        create: song_ids.map(id => ({
                            song_id: id,
                        })),
                    };
                }
            }

            const playlist = await prisma.playlists.update({
                where: { id: +id },
                data: {
                    name,
                    description,
                    image,
                    user_id,
                    is_active,
                    songs: song_ids ? songUpdate : undefined,
                },
                include: {
                    songs: true,
                    user: true,
                },
            });

            // Map to interface
            const mappedPlaylist = {
                id: playlist.id,
                name: playlist.name,
                description: playlist.description,
                image: playlist.image,
                user_id: playlist.user_id,
                songs_count: playlist.songs.length,
                is_active: playlist.is_active,
                created_at: playlist.created_at.toISOString(),
            };

            return resolve(mappedPlaylist);
        }
    )
);