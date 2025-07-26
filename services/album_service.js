// src/services/album_service.js

import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";
import { ApiError } from "../lib/api_error.js";
import { NOT_FOUND_STATUS, BAD_REQUEST_STATUS } from "../lib/status_codes.js";
import { AlbumDTO } from "../mappers/album.dto.js";
import { parseBoolean } from "../lib/parser.js";

/**
 * Fetches all albums with their related artist, songs, and genres.
 */
export const getAllAlbums = async () => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const albums = await prisma.albums.findMany({
            include: {
                artist: true,
                songs: { include: { song: true } },
                genres: { include: { genre: true } },
            },
        });
        resolve(
            AlbumDTO.fromMany(albums)
        );
    })
);

/**
 * Fetches a single album by its ID.
 * @param {number} id - The ID of the album.
 */
export const getAlbumById = async (id) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const album = await prisma.albums.findUnique({
            where: { id: +id },
            include: {
                artist: true,
                songs: { include: { song: true } },
                genres: { include: { genre: true } },
            },
        });

        if (!album) {
            throw new ApiError("Album not found", null, NOT_FOUND_STATUS);
        }

        resolve(
            AlbumDTO.from(album)
        );
    })
);

/**
 * Creates a new album and connects it to songs and genres.
 * @param {object} payload - The album data.
 * @param {string} payload.name
 * @param {string} payload.description
 * @param {string} payload.image
 * @param {number} payload.artist_id
 * @param {string} payload.release_date
 * @param {string} payload.album_type
 * @param {number[]} payload.song_ids - Array of song IDs to connect.
 * @param {number[]} payload.genre_ids - Array of genre IDs to connect.
 */
export const createAlbum = async ({ name, description, image, artist_id, release_date, album_type, song_ids = [], genre_ids = [] }) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        // Use a transaction to ensure all or nothing is created
        const newAlbum = await prisma.$transaction(async (tx) => {
            const album = await tx.albums.create({
                data: {
                    name,
                    description,
                    image,
                    artist_id: +artist_id,
                    release_date: new Date(release_date),
                    album_type,
                    songs_count: song_ids.length,
                    genres_count: genre_ids.length,
                },
            });

            // Connect songs to the album
            if (song_ids.length > 0) {
                await tx.album_songs.createMany({
                    data: song_ids.map(songId => ({
                        album_id: album.id,
                        song_id: +songId,
                    })),
                });
            }

            // Connect genres to the album
            if (genre_ids.length > 0) {
                await tx.album_genres.createMany({
                    data: genre_ids.map(genreId => ({
                        album_id: album.id,
                        genre_id: +genreId,
                    })),
                });
            }
            return album;
        });

        resolve(newAlbum);
    })
);

/**
 * Updates an existing album and its connections.
 * @param {number} id - The ID of the album to update.
 * @param {object} payload - The data to update.
 */
export const updateAlbum = async (id, payload) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const { name, description, image, artist_id, release_date, album_type, is_active, is_featured, song_ids, genre_ids } = payload;

        const album = await prisma.albums.findUnique({ where: { id: +id } });
        if (!album) {
            throw new ApiError("Album not found", null, NOT_FOUND_STATUS);
        }

        const updatedAlbum = await prisma.$transaction(async (tx) => {
            // 1. Update the main album data
            const updated = await tx.albums.update({
                where: { id: +id },
                data: {
                    name,
                    description,
                    image,
                    artist_id: artist_id ? +artist_id : undefined,
                    release_date: release_date ? new Date(release_date) : undefined,
                    album_type,
                    is_active: parseBoolean(is_active),
                    is_featured: parseBoolean(is_featured),
                    songs_count: song_ids ? song_ids.length : undefined,
                    genres_count: genre_ids ? genre_ids.length : undefined,
                },
            });

            // 2. Update song connections (if provided)
            if (song_ids) {
                // First, remove all existing song connections
                await tx.album_songs.deleteMany({ where: { album_id: +id } });
                // Then, create the new connections
                await tx.album_songs.createMany({
                    data: song_ids.map(songId => ({
                        album_id: updated.id,
                        song_id: +songId,
                    })),
                });
            }

            // 3. Update genre connections (if provided)
            if (genre_ids) {
                await tx.album_genres.deleteMany({ where: { album_id: +id } });
                await tx.album_genres.createMany({
                    data: genre_ids.map(genreId => ({
                        album_id: updated.id,
                        genre_id: +genreId,
                    })),
                });
            }

            return updated;
        });

        resolve(
            AlbumDTO.from(updatedAlbum)
        );
    })
);

/**
 * Deletes an album by its ID.
 * @param {number} id - The ID of the album to delete.
 */
export const deleteAlbum = async (id) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        // Use a transaction to delete the album and its relations
        await prisma.$transaction(async (tx) => {
            // First, delete connections in join tables
            await tx.album_songs.deleteMany({ where: { album_id: +id } });
            await tx.album_genres.deleteMany({ where: { album_id: +id } });
            
            // Then, delete the album itself
            await tx.albums.delete({ where: { id: +id } });
        });
        
        resolve({ message: "Album deleted successfully." });
    })
);


/**
 * Fetches new album releases within a specified time period.
 * @param {object} options - Query options
 * @param {number} options.limit - Maximum number of albums to return
 * @param {number} options.days - Number of days to look back (default: 30)
 */
export const getNewReleases = async ({ limit = 10, days = 30 } = {}) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const newReleases = await prisma.albums.findMany({
            where: {
                // release_date: {
                //     gte: cutoffDate
                // },
                is_active: true
            },
            orderBy: {
                release_date: 'desc'
            },
            take: +limit,
            include: {
                artist: true,
                songs: { include: { song: true } },
                genres: { include: { genre: true } },
            }
        });

        
        

        resolve(
            AlbumDTO.fromMany(newReleases)
        );
    })
);


/**
 * Fetches new album releases for a specific genre within a specified time period.
 * @param {number} genreId - The ID of the genre
 * @param {object} options - Query options
 * @param {number} options.limit - Maximum number of albums to return
 * @param {number} options.days - Number of days to look back (default: 30)
 */
export const getNewReleasesByGenre = async (genreId, { limit = 10, days = 30 } = {}) => new Promise(
    promiseAsyncWrapper(async (resolve) => {
        if (!genreId) {
            throw new ApiError("Genre ID is required", null, BAD_REQUEST_STATUS);
        }

        const cutoffDate = new Date();        
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const newReleases = await prisma.albums.findMany({
            where: {
                is_active: true,
                release_date: {
                    gte: cutoffDate
                },
                genres: {
                    some: {
                        genre_id: +genreId
                    }
                }
            },
            orderBy: {
                release_date: 'desc'
            },
            take: +limit,
            include: {
                artist: true,
                songs: { include: { song: true } },
                genres: { include: { genre: true } },
            }
        });

        resolve(
            AlbumDTO.fromMany(newReleases)
        );
    })
);
