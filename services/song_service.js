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
                release_date: song.release_date,
                artist: song.artist,
                genre: song.genre,
                is_active: song.is_active,
                created_at: song.created_at.toISOString(),
            }));

            return resolve(mappedSongs);
        }
    )
);

export const createSong = async ({ title, artist_id, audio_path, image, genre_id, release_date }) => new Promise(
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

                    song_id
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
                    release_date,
                    genre_id
                },
                include: {
                    genre: true,
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
            const { title, artist_id, image, genre_id, is_active, release_date } = payload;

            const updateData = {
                title,
                image,
                is_active,
                release_date
            };

            if (artist_id != undefined) {
                updateData.artist = {
                    connect: { id: artist_id }
                };
            }

            if (genre_id != undefined) {
                updateData.genre = {
                    connect: { id: genre_id }
                };
            }

            const song = await prisma.songs.update({
                where: { id: +id },
                data: updateData,
                include: {
                    genre: true,
                    audio: true,
                    artist: true,
                },
            });

            // Map to interface
            const mappedSong = {
                id: song.id,
                title: song.title,
                image: song.image,
                duration: 0,
                artist_id: song.artist_id,
                is_active: song.is_active,
                created_at: song.created_at.toISOString(),
            };

            return resolve(mappedSong);
        }
    )
);




export const getSongById = async (id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const song = await prisma.songs.findUnique({
                where: { id: +id },
                include: {
                    genre: true,
                    audio: true,
                    artist: true,
                },
            });

            if (!song) {
                throw new ApiError('Song not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            // Map to interface
            const mappedSong = {
                id: song.id,
                title: song.title,
                image: song.image,
                duration: song?.audio?.duration || 0,
                artist: song.artist,
                genre: song.genre,
                // genres_count: song.genre.length,
                is_active: song.is_active,
                created_at: song.created_at.toISOString(),
            };

            return resolve(mappedSong);
        }
    )
);
