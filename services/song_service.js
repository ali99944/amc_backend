// song_service.js
import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";
import { getAudioDuration } from "../lib/audio.js";
import { generateTrackNumber } from "../lib/random.js";
import { SongDTO } from "../mappers/song.dto.js";
import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";
import { BAD_REQUEST_STATUS } from "../lib/status_codes.js";

export const getAllSongs = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const songs = await prisma.songs.findMany({
                include: {
                    genre: true,
                    artist: true,
                    original_audio: true
                },
            });

            // Map to interface
            const mappedSongs = songs.map(song => SongDTO.from(song));

            return resolve(mappedSongs);
        }
    )
);

export const createSong = async ({ title, artist_id, audio_path, image, genre_id, release_date }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            // Get audio duration
            const duration = await getAudioDuration('public/' + audio_path);

            // Create song
            const song = await prisma.songs.create({
                data: {
                    title,
                    image,
                    artist_id,
                    is_active: true,
                    track_number: generateTrackNumber(),
                    release_date,
                    genre_id,

                    original_audio: {
                        create: {
                            file_path: audio_path,
                            format: audio_path.split('.').pop(), // e.g., mp3
                            file_size: (await import('fs')).statSync('public/' + audio_path).size,
                            duration
                        }
                    }
                },
                include: {
                    genre: true,
                    original_audio: true,
                    artist: true,
                },
            });



            return resolve(SongDTO.from(song));
        }
    )
);

export const deleteSong = async (id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const song = await prisma.songs.findUnique({
                where: {
                    id: +id
                }
            });

            if (!song) {
                throw new ApiError("Song not found", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            // Delete song (cascades to song_genre)
            await prisma.songs.delete({
                where: {
                    id: +id
                }
            });

            return resolve(true);
        }
    )
);

export const updateSong = async ({ id, payload }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const { title, description, lyrics, artist_id, image, genre_id, is_active, release_date } = payload;

            const updateData = {
                title,
                description,
                lyrics,
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
                    original_audio: true,
                    artist: true,
                },
            });

            return resolve(SongDTO.from(song));
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
                    original_audio: true,
                    artist: true,
                },
            });

            if (!song) {
                throw new ApiError('Song not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            return resolve(SongDTO.from(song));
        }
    )
);

export const searchSongs = async (query) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const songs = await prisma.songs.findMany({
                include: {
                    genre: true,
                    original_audio: true,
                    artist: true,
                    audio_versions: true
                },
            });


            const search_results = songs.filter(song => {
                return song?.title?.includes(query.toLowerCase()) ||
                song?.description?.includes(query.toLowerCase())
            })

            return resolve(search_results);
        }
    )
);


export const checkIsSongLiked = async ({ song_id, user_id }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const like = await prisma.user_song_likes.findFirst({
                where: {
                    song_id: +song_id,
                    user_id: +user_id
                }
            });            

            return resolve(!!like); // Returns true if liked, false if not
        }
    )
);

export const likeSong = async (song_id, user_id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            // Check if song exists
            const song = await prisma.songs.findUnique({
                where: { id: +song_id }
            });

            if (!song) {
                throw new ApiError('Song not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            // Check if already liked
            const existingLike = await prisma.user_song_likes.findFirst({
                where: {
                    song_id: +song_id,
                    user_id: +user_id
                }
            });

            if (existingLike) {
                throw new ApiError('Song already liked', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            // Create like
            await prisma.user_song_likes.create({
                data: {
                    song_id: +song_id,
                    user_id: +user_id
                }
            });

            return resolve(true);
        }
    )
);

export const unlikeSong = async (song_id, user_id) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            // Check if like exists
            const like = await prisma.user_song_likes.findFirst({
                where: {
                    song_id: +song_id,
                    user_id: +user_id
                }
            });

            if (!like) {
                throw new ApiError('Song not liked', BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            }

            // Delete like
            await prisma.user_song_likes.delete({
                where: {
                    id: like.id
                }
            });

            return resolve(true);
        }
    )
);
