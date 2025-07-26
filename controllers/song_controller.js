// song_controller.js
import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";
import prisma from "../lib/prisma.js";
import { generateTrackNumber } from "../lib/random.js";
import { BAD_REQUEST_STATUS, OK_STATUS } from "../lib/status_codes.js";
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { checkIsSongLiked, createSong, deleteSong, getAllSongs, getSongById, likeSong, searchSongs, unlikeSong, updateSong } from "../services/song_service.js";

export const getAllSongsController = asyncWrapper(
    async (_, res) => {
        const songs = await getAllSongs();
        
        return res.status(OK_STATUS).json(songs);
    }
);

export const createSongController = asyncWrapper(
    async (req, res, next) => {
        const { title, artist_id, genre_id, release_date } = req.body;
        const audio_file = req.files?.audio?.[0];
        const image_file = req.files?.image?.[0];

        

        // Validate inputs
        if (!audio_file) {
            const audio_missing_error = new ApiError("Audio file is required", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            return next(audio_missing_error);
        }

        await Validator.validateNotNull({ title });
        await Validator.isText(title, { minLength: 2, maxLength: 100 });

        // await Validator.validateFile(audio_file, {
        //     allowedTypes: ['audio/mpeg', 'audio/wav'],
        //     maxSize: 20 * 1024 * 1024, // 20MB
        //     fieldName: 'audio',
        // });
        // if (image_file) {
        //     await Validator.validateFile(image_file, {
        //         allowedTypes: ['image/jpeg', 'image/png'],
        //         maxSize: 5 * 1024 * 1024, // 5MB
        //         fieldName: 'image',
        //     });
        // }

        const song = await createSong({
            title,
            artist_id: +artist_id,
            audio_path: 'songs/assets/' + audio_file.filename,
            image: image_file ? 'songs/assets/' + image_file.filename : null,
            genre_id: +genre_id,
            track_number: generateTrackNumber(),
            release_date
        });

        return res.status(OK_STATUS).json(song);
    }
);

export const deleteSongController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        await Validator.isNumber(id, { integer: true, min: 1 });
        const deletedSong = await deleteSong(id);
        return res.status(OK_STATUS).json(deletedSong);
    }
);

export const updateSongController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        const { title, description, lyrics, artist_id, genre_id, is_active, release_date } = req.body;
        const audio_file = req.files?.audio?.[0];
        const image_file = req.files?.image?.[0];

        // Validate inputs
        await Validator.isNumber(+id, { integer: true, min: 1 });

        if(title){
            await Validator.isText(title, { minLength: 2, maxLength: 100 });
        }

        if (artist_id) {
            await Validator.isNumber(artist_id, { integer: true, min: 1 });
        }

        if (is_active !== undefined) {
            await Validator.isEnum(is_active, [true, false], "is_active must be a boolean");
        }
        if (audio_file) {
            await Validator.validateFile(audio_file, {
                allowedTypes: ['audio/mpeg', 'audio/wav'],
                maxSize: 20 * 1024 * 1024,
                fieldName: 'audio',
            });
        }
        if (image_file) {
            await Validator.validateFile(image_file, {
                allowedTypes: ['image/jpeg', 'image/png'],
                maxSize: 5 * 1024 * 1024,
                fieldName: 'image',
            });
        }

        const updatedSong = await updateSong({
            id,
            payload: {
                title,
                description,
                lyrics,
                artist_id: artist_id ? +artist_id : undefined,
                audio_path: audio_file ? 'audios/' + audio_file.filename : undefined,
                image: image_file ? 'images/songs/' + image_file.filename : undefined,
                genre_id: genre_id ? +genre_id : null,
                is_active: is_active !== undefined ? is_active : undefined,
                release_date
            },
        });

        return res.status(OK_STATUS).json(updatedSong);
    }
);

export const getSongByIdController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        await Validator.isNumber(id, { integer: true, min: 1 });
        const song = await getSongById(id);
        return res.status(OK_STATUS).json(song);
    }
);

export const searchSongsController = asyncWrapper(
    async (req, res) => {
        const { q } = req.query;
        const songs = await searchSongs(q);
        return res.status(OK_STATUS).json(songs);
    }
);

export const checkSongLikeController = asyncWrapper(
    async (req, res) => {
        const { id: song_id } = req.params;
        const user_id = req.user.id;



        // Validate inputs
        if (!song_id) {
            return res.status(400).json({ error: 'Invalid song ID' });
        }

        const result = await checkIsSongLiked({
            user_id: user_id,
            song_id: parseInt(song_id)
        });
        
        return res.status(200).json({ isLiked: result });
    }
);


export const likeSongController = asyncWrapper(
    async (req, res) => {
        const { id: song_id } = req.params;
        const user_id = req.user.id;

        // Validate inputs
        await Validator.isNumber(song_id, { integer: true, min: 1 });
        await Validator.isNumber(user_id, { integer: true, min: 1 });

        await likeSong(song_id, user_id);
        return res.status(OK_STATUS).json({ message: 'Song liked successfully' });
    }
);

export const unlikeSongController = asyncWrapper(
    async (req, res) => {
        const { id: song_id } = req.params;
        const user_id = req.user.id;

        console.log(song_id);
        console.log(user_id);
        


        // Validate inputs
        await Validator.isNumber(song_id, { integer: true, min: 1 });
        await Validator.isNumber(user_id, { integer: true, min: 1 });

        await unlikeSong(song_id, user_id);
        return res.status(OK_STATUS).json({ message: 'Song unliked successfully' });
    }
);
