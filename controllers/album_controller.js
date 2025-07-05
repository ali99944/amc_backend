// album_service.js
import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";
import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_STATUS } from "../lib/status_codes.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";

export const getAllAlbums = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const albums = await prisma.albums.findMany({
                include: {
                    songs: true,
                    genres: true,
                    artist: true,
                },
            });

            // Map to interface
            const mappedAlbums = albums.map(album => ({
                id: album.id.toString(),
                title: album.title,
                image: album.image,
                artist_id: album.artist_id.toString(),
                songs_count: album.songs.length,
                genres_count: album.genres.length,
                release_date: album.release_date.toISOString(),
                is_active: album.is_active,
                created_at: album.created_at.toISOString(),
            }));

            return resolve(mappedAlbums);
        }
    )
);

export const createAlbum = async ({ title, artist_id, release_date, image, song_ids, genre_ids }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            // Verify artist exists
            const artist = await prisma.artists.findUnique({ where: { id: artist_id } });
            if (!artist) {
                throw new ApiError("Artist not found", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            const album = await prisma.albums.create({
                data: {
                    title,
                    image,
                    artist_id,
                    release_date,
                    is_active: true,
                    songs: song_ids.length > 0 ? {
                        create: song_ids.map(id => ({
                            song_id: id,
                        })),
                    } : undefined,
                    genres: genre_ids.length > 0 ? {
                        create: genre_ids.map(id => ({
                            genre_id: id,
                        })),
                    } : undefined,
                },
                include: {
                    songs: true,
                    genres: true,
                    artist: true,
                },
            });

            // Update artist's total_songs if songs are added
            if (song_ids.length > 0) {
                await prisma.artists.update({
                    where: { id: artist_id },
                    data: { total_songs: { increment: song_ids.length } },
                });
            }

            // Update genres' total_songs if songs are added
            if (song_ids.length > 0 && genre_ids.length > 0) {
                const songs = await prisma.songs.findMany({
                    where: { id: { in: song_ids } },
                    include: { genres: true },
                });
                const genreIdsToUpdate = new Set(genre_ids);
                songs.forEach(song => song.genres.forEach(g => genreIdsToUpdate.add(g.genre_id)));
                await prisma.genres.updateMany({
                    where: { id: { in: Array.from(genreIdsToUpdate) } },
                    data: { total_songs: { increment: song_ids.length } },
                });
            }

            // Map to interface
            const mappedAlbum = {
                id: album.id.toString(),
                title: album.title,
                image: album.image,
                artist_id: album.artist_id.toString(),
                songs_count: album.songs.length,
                genres_count: album.genres.length,
                release_date: album.release_date.toISOString(),
                is_active: album.is_active,
                created_at: album.created_at.toISOString(),
            };

            return resolve(mappedAlbum);
        }
    )
);

export const deleteAlbum = async (id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const album = await prisma.albums.findUnique({
                where: { id: +id },
                include: { songs: true, genres: true, artist: true },
            });

            if (!album) {
                throw new ApiError("Album not found", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            // Delete album (cascades to album_song and album_genre)
            const deletedAlbum = await prisma.albums.delete({
                where: { id: +id },
                include: { songs: true, genres: true, artist: true },
            });

            // Update artist's total_songs
            if (deletedAlbum.songs.length > 0) {
                await prisma.artists.update({
                    where: { id: deletedAlbum.artist_id },
                    data: { total_songs: { decrement: deletedAlbum.songs.length } },
                });
            }

            // Update genres' total_songs
            if (deletedAlbum.songs.length > 0 && deletedAlbum.genres.length > 0) {
                const songs = await prisma.songs.findMany({
                    where: { id: { in: deletedAlbum.songs.map(s => s.song_id) } },
                    include: { genres: true },
                });
                const genreIdsToUpdate = new Set(deletedAlbum.genres.map(g => g.genre_id));
                songs.forEach(song => song.genres.forEach(g => genreIdsToUpdate.add(g.genre_id)));
                await prisma.genres.updateMany({
                    where: { id: { in: Array.from(genreIdsToUpdate) } },
                    data: { total_songs: { decrement: deletedAlbum.songs.length } },
                });
            }

            // Map to interface
            const mappedAlbum = {
                id: deletedAlbum.id.toString(),
                title: deletedAlbum.title,
                image: deletedAlbum.image,
                artist_id: deletedAlbum.artist_id.toString(),
                songs_count: deletedAlbum.songs.length,
                genres_count: deletedAlbum.genres.length,
                release_date: deletedAlbum.release_date.toISOString(),
                is_active: deletedAlbum.is_active,
                created_at: deletedAlbum.created_at.toISOString(),
            };

            return resolve(mappedAlbum);
        }
    )
);

export const updateAlbum = async ({ id, payload }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const { title, artist_id, release_date, image, song_ids, genre_ids, is_active } = payload;

            // Verify artist exists if artist_id is provided
            if (artist_id) {
                const artist = await prisma.artists.findUnique({ where: { id: artist_id } });
                if (!artist) {
                    throw new ApiError("Artist not found", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
                }
            }

            // Handle song updates
            let songUpdate = {};
            if (song_ids) {
                // Get current songs
                const currentSongs = await prisma.album_song.findMany({
                    where: { album_id: +id },
                    select: { song_id: true },
                });
                const currentSongIds = currentSongs.map(s => s.song_id);

                // Delete existing song associations
                await prisma.album_song.deleteMany({
                    where: { album_id: +id },
                });

                // Create new song associations
                if (song_ids.length > 0) {
                    songUpdate = {
                        create: song_ids.map(id => ({
                            song_id: id,
                        })),
                    };
                }

                // Update artist's total_songs if artist_id changes or songs change
                const currentAlbum = await prisma.albums.findUnique({
                    where: { id: +id },
                    select: { artist_id: true },
                });
                const oldArtistId = currentAlbum.artist_id;
                const newArtistId = artist_id || oldArtistId;
                if (currentSongIds.length > 0) {
                    await prisma.artists.update({
                        where: { id: oldArtistId },
                        data: { total_songs: { decrement: currentSongIds.length } },
                    });
                }
                if (song_ids.length > 0) {
                    await prisma.artists.update({
                        where: { id: newArtistId },
                        data: { total_songs: { increment: song_ids.length } },
                    });
                }

                // Update genres' total_songs
                if (song_ids.length > 0 || currentSongIds.length > 0) {
                    const oldSongs = await prisma.songs.findMany({
                        where: { id: { in: currentSongIds } },
                        include: { genres: true },
                    });
                    const newSongs = song_ids.length > 0 ? await prisma.songs.findMany({
                        where: { id: { in: song_ids } },
                        include: { genres: true },
                    }) : [];
                    const oldGenreIds = new Set(oldSongs.flatMap(s => s.genres.map(g => g.genre_id)));
                    const newGenreIds = new Set(newSongs.flatMap(s => s.genres.map(g => g.genre_id)));
                    const addedGenres = Array.from(newGenreIds).filter(id => !oldGenreIds.has(id));
                    const removedGenres = Array.from(oldGenreIds).filter(id => !newGenreIds.has(id));
                    if (addedGenres.length > 0) {
                        await prisma.genres.updateMany({
                            where: { id: { in: addedGenres } },
                            data: { total_songs: { increment: song_ids.length } },
                        });
                    }
                    if (removedGenres.length > 0) {
                        await prisma.genres.updateMany({
                            where: { id: { in: removedGenres } },
                            data: { total_songs: { decrement: currentSongIds.length } },
                        });
                    }
                }
            }

            // Handle genre updates
            let genreUpdate = {};
            if (genre_ids) {
                // Delete existing genre associations
                await prisma.album_genre.deleteMany({
                    where: { album_id: +id },
                });

                // Create new genre associations
                if (genre_ids.length > 0) {
                    genreUpdate = {
                        create: genre_ids.map(id => ({
                            genre_id: id,
                        })),
                    };
                }
            }

            const album = await prisma.albums.update({
                where: { id: +id },
                data: {
                    title,
                    artist_id,
                    release_date,
                    image,
                    is_active,
                    songs: song_ids ? songUpdate : undefined,
                    genres: genre_ids ? genreUpdate : undefined,
                },
                include: {
                    songs: true,
                    genres: true,
                    artist: true,
                },
            });

            // Map to interface
            const mappedAlbum = {
                id: album.id.toString(),
                title: album.title,
                image: album.image,
                artist_id: album.artist_id.toString(),
                songs_count: album.songs.length,
                genres_count: album.genres.length,
                release_date: album.release_date.toISOString(),
                is_active: album.is_active,
                created_at: album.created_at.toISOString(),
            };

            return resolve(mappedAlbum);
        }
    )
);