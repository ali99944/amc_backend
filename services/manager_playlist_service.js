// src/services/manager_playlist_service.js

import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";
import { ApiError } from "../lib/api_error.js";
import { NOT_FOUND_STATUS } from "../lib/status_codes.js";

/**
 * Creates a new system playlist (e.g., editorial, curated).
 * @param {object} payload - The playlist data from the control panel.
 */
export const createSystemPlaylist = ({ name, description, image, source, song_ids = [] }) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const newPlaylist = await prisma.$transaction(async (tx) => {
            const playlist = await tx.playlist.create({
                data: {
                    name,
                    description,
                    image,
                    type: 'system', // Explicitly set type to system
                    source,         // e.g., 'editorial'
                },
            });

            if (song_ids.length > 0) {
                await tx.playlistSong.createMany({
                    data: song_ids.map(songId => ({
                        playlistId: playlist.id,
                        songId: +songId,
                    })),
                });
            }
            return playlist;
        });
        resolve(newPlaylist);
    })
);

/**
 * Updates any playlist from the control panel.
 * @param {number} playlistId - The ID of the playlist to update.
 * @param {object} payload - The data to update.
 */
export const updatePlaylistAsManager = (playlistId, payload) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const { name, description, image, isActive, source, song_ids } = payload;
        
        const playlist = await prisma.playlist.findUnique({ where: { id: +playlistId } });
        if (!playlist) {
            throw new ApiError("Playlist not found", null, NOT_FOUND_STATUS);
        }

        const updatedPlaylist = await prisma.$transaction(async (tx) => {
            const updated = await tx.playlist.update({
                where: { id: +playlistId },
                data: { name, description, image, isActive, source },
            });

            if (song_ids) { // If a new list of songs is provided, replace the old one
                await tx.playlistSong.deleteMany({ where: { playlistId: +playlistId } });
                await tx.playlistSong.createMany({
                    data: song_ids.map(songId => ({
                        playlistId: updated.id,
                        songId: +songId,
                    })),
                });
            }
            return updated;
        });
        resolve(updatedPlaylist);
    })
);

/**
 * Deletes any playlist from the control panel.
 * @param {number} playlistId - The ID of the playlist to delete.
 */
export const deletePlaylistAsManager = (playlistId) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        // Ensure playlist exists before trying to delete relations
        const playlist = await prisma.playlist.findUnique({ where: { id: +playlistId } });
        if (!playlist) {
            throw new ApiError("Playlist not found", null, NOT_FOUND_STATUS);
        }
        
        await prisma.$transaction([
            prisma.playlistSong.deleteMany({ where: { playlistId: +playlistId } }),
            prisma.playlist.delete({ where: { id: +playlistId } }),
        ]);
        resolve({ message: "Playlist deleted successfully by manager." });
    })
);

/**
 * A service for the control panel to view all playlists, both user and system.
 */
export const getAllPlaylistsAsManager = () => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const playlists = await prisma.playlist.findMany({
            include: {
                user: { select: { name: true } }, // See which user created it
                _count: { select: { songs: true } } // Get the song count efficiently
            },
            orderBy: { createdAt: 'desc' }
        });
        resolve(playlists);
    })
);