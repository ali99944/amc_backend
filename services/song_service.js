import { getCurrentDate } from "../lib/date.js";
import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";


export const getAllSongs = async () => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const songs = await prisma.songs.findMany({
                include: {
                    genre: true,
                    playlists: true,
                    album: true,
                    artist: true,
                    likes: true
                }
            })

            return songs
        }
    )
)

export const createSong = async ({
    title, artist_id, album_id, genre_id, release_date,
    audio, cover
}) => new Promise(
    promiseAsyncWrapper(
        async (resolve, reject) => {
            const song = await prisma.songs.create({
                data: {
                    title,
                    release_date,
                    artist_id: +artist_id,
                    genre_id: +genre_id,
                    
                    audio_src: audio,
                    cover_image: cover,

                    album_id: (album_id == null || album_id == undefined) ? undefined : a+album_id,
                    created_at: getCurrentDate()
                }
            })

            return song
        }
    )
)