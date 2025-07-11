import { ApiError } from "../lib/api_error.js";
import { transcodeSongSingle } from "../lib/audio.js";
import prisma from "../lib/prisma.js";
import promiseAsyncWrapper from "../lib/wrappers/promise_async_wrapper.js";

export const getSongAudioVersions = ({ song_id }) => new Promise(
    promiseAsyncWrapper(
        async (resolve) => {
            const audio_versions = await prisma.audio_versions.findMany({
                where: {
                    song_id
                }
            })

            return resolve(audio_versions)
        }
    )
)

export const createAudioVersion = ({ song_id, bitrate }) => new Promise(
    promiseAsyncWrapper(
        async (resolve, reject) => {
            const song = await prisma.songs.findFirst({
                where: {
                    id: +song_id
                },

                include: {
                    original_audio: true
                }
            })

            if (!song) {
                return reject(new ApiError('Song not found', BAD_REQUEST_CODE, BAD_REQUEST_STATUS));
            }

            const transcoded_version = await transcodeSongSingle(song.original_audio.file_path, '.', song.title, bitrate);

            const audio_version = await prisma.audio_versions.create({
                data: {
                    song_id: +song_id,
                    bitrate,
                    file_path: transcoded_version.filename,
                    file_size: transcoded_version.size
                }
            })

            return resolve(audio_version);
        }
    )
)
