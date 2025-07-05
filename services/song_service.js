// song_service.js
import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";
import { getAudioDuration } from "../lib/audio.js";

export const getAllSongs = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const songs = await prisma.songs.findMany({
                include: {
                    genre: true,
                    artist: true,
                    audio: true
                },
            });

            // Map to interface
            const mappedSongs = songs.map(song => ({
                id: song.id,
                title: song.title,
                image: song.image,
                // duration: song.audio.duration || 0,
                artist: song.artist,
                genre: song.genre,
                is_active: song.is_active,
                created_at: song.created_at.toISOString(),
            }));

            return resolve(mappedSongs);
        }
    )
);

export const createSong = async ({ title, artist_id, audio_path, image, genre_ids }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            // Get audio duration
            const duration = await getAudioDuration('public/' + audio_path);

            // Create audio record
            const audio = await prisma.audio.create({
                data: {
                    file_path: audio_path,
                    format: audio_path.split('.').pop(), // e.g., mp3
                    file_size: (await import('fs')).statSync('public/' + audio_path).size,
                    duration,
                },
            });

            // Create song
            const song = await prisma.songs.create({
                data: {
                    title,
                    image,
                    artist_id,
                    audio_id: audio.id,
                    is_active: true,
                    genres: genre_ids.length > 0 ? {
                        create: genre_ids.map(id => ({
                            genre_id: id,
                        })),
                    } : undefined,
                },
                include: {
                    genres: true,
                    audio: true,
                    artist: true,
                },
            });

            // Update artist's total_songs (if needed)
            await prisma.artists.update({
                where: { id: artist_id },
                data: { total_songs: { increment: 1 } },
            });

            // Update genres' total_songs
            if (genre_ids.length > 0) {
                await prisma.genres.updateMany({
                    where: { id: { in: genre_ids } },
                    data: { total_songs: { increment: 1 } },
                });
            }

            // Map to interface
            const mappedSong = {
                id: song.id,
                title: song.title,
                image: song.image,
                duration: song.audio.duration || 0,
                artist_id: song.artist_id,
                genres_count: song.genres.length,
                is_active: song.is_active,
                created_at: song.created_at.toISOString(),
            };

            return resolve(mappedSong);
        }
    )
);

export const deleteSong = async (id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const song = await prisma.songs.findUnique({
                where: { id: +id },
                include: { genres: true, audio: true },
            });

            if (!song) {
                throw new ApiError("Song not found", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            // Delete song (cascades to song_genre)
            const deletedSong = await prisma.songs.delete({
                where: { id: +id },
                include: { genres: true, audio: true, artist: true },
            });

            // Update artist's total_songs
            await prisma.artists.update({
                where: { id: deletedSong.artist_id },
                data: { total_songs: { decrement: 1 } },
            });

            // Update genres' total_songs
            const genreIds = deletedSong.genres.map(g => g.genre_id);
            if (genreIds.length > 0) {
                await prisma.genres.updateMany({
                    where: { id: { in: genreIds } },
                    data: { total_songs: { decrement: 1 } },
                });
            }

            // Map to interface
            const mappedSong = {
                id: deletedSong.id,
                title: deletedSong.title,
                image: deletedSong.image,
                duration: deletedSong.audio.duration || 0,
                artist_id: deletedSong.artist_id,
                genres_count: deletedSong.genres.length,
                is_active: deletedSong.is_active,
                created_at: deletedSong.created_at.toISOString(),
            };

            return resolve(mappedSong);
        }
    )
);

export const updateSong = async ({ id, payload }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const { title, artist_id, audio_path, image, genre_ids, is_active } = payload;

            // Handle audio update
            let audio_id = null;
            if (audio_path) {
                const duration = await getAudioDuration('public/' + audio_path);
                const audio = await prisma.audio.create({
                    data: {
                        file_path: audio_path,
                        format: audio_path.split('.').pop(),
                        file_size: (await import('fs')).statSync('public/' + audio_path).size,
                        duration,
                    },
                });
                audio_id = audio.id;
            }

            // Handle genre updates
            let genreUpdate = {};
            if (genre_ids) {
                // Get current genres
                const currentGenres = await prisma.song_genre.findMany({
                    where: { song_id: +id },
                    select: { genre_id: true },
                });
                const currentGenreIds = currentGenres.map(g => g.genre_id);

                // Delete existing genre associations
                await prisma.song_genre.deleteMany({
                    where: { song_id: +id },
                });

                // Create new genre associations
                if (genre_ids.length > 0) {
                    genreUpdate = {
                        create: genre_ids.map(id => ({
                            genre_id: id,
                        })),
                    };

                    // Update total_songs for added/removed genres
                    const addedGenres = genre_ids.filter(id => !currentGenreIds.includes(id));
                    const removedGenres = currentGenreIds.filter(id => !genre_ids.includes(id));
                    if (addedGenres.length > 0) {
                        await prisma.genres.updateMany({
                            where: { id: { in: addedGenres } },
                            data: { total_songs: { increment: 1 } },
                        });
                    }
                    if (removedGenres.length > 0) {
                        await prisma.genres.updateMany({
                            where: { id: { in: removedGenres } },
                            data: { total_songs: { decrement: 1 } },
                        });
                    }
                }
            }

            // Update artist total_songs if artist_id changes
            if (artist_id) {
                const currentSong = await prisma.songs.findUnique({
                    where: { id: +id },
                    select: { artist_id: true },
                });
                if (currentSong && currentSong.artist_id !== artist_id) {
                    await prisma.artists.update({
                        where: { id: currentSong.artist_id },
                        data: { total_songs: { decrement: 1 } },
                    });
                    await prisma.artists.update({
                        where: { id: artist_id },
                        data: { total_songs: { increment: 1 } },
                    });
                }
            }

            const song = await prisma.songs.update({
                where: { id: +id },
                data: {
                    title,
                    artist_id,
                    audio_id,
                    image,
                    is_active,
                    genres: genre_ids ? genreUpdate : undefined,
                },
                include: {
                    genres: true,
                    audio: true,
                    artist: true,
                },
            });

            // Map to interface
            const mappedSong = {
                id: song.id,
                title: song.title,
                image: song.image,
                duration: song.audio.duration || 0,
                artist_id: song.artist_id,
                genres_count: song.genres.length,
                is_active: song.is_active,
                created_at: song.created_at.toISOString(),
            };

            return resolve(mappedSong);
        }
    )
);


