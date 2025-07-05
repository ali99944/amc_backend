// song_controller.js
import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";
import { BAD_REQUEST_STATUS, OK_STATUS } from "../lib/status_codes.js";
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { createSong, deleteSong, getAllSongs, updateSong } from "../services/song_service.js";

export const getAllSongsController = asyncWrapper(
    async (_, res) => {
        const songs = await getAllSongs();
        return res.status(OK_STATUS).json(songs);
    }
);

export const createSongController = asyncWrapper(
    async (req, res, next) => {
        const { title, artist_id, genre_ids } = req.body;
        const audio_file = req.files?.audio?.[0];
        const image_file = req.files?.image?.[0];

        console.log(audio_file);
        console.log(image_file);
        

        

        // Validate inputs
        if (!audio_file) {
            const audio_missing_error = new ApiError("Audio file is required", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            return next(audio_missing_error);
        }

        await Validator.validateNotNull({ title, artist_id });
        await Validator.isText(title, { minLength: 2, maxLength: 100 });
        await Validator.isNumber(artist_id, { integer: true, min: 1 });
        if (genre_ids) {
            const parsedGenres = JSON.parse(genre_ids || '[]');
            await Validator.isArray(parsedGenres, { minLength: 0, maxLength: 10, arrayName: "genre_ids" });
            for (const id of parsedGenres) {
                await Validator.isNumber(id, { integer: true, min: 1 });
            }
        }
        await Validator.validateFile(audio_file, {
            allowedTypes: ['audio/mpeg', 'audio/wav'],
            maxSize: 20 * 1024 * 1024, // 20MB
            fieldName: 'audio',
        });
        if (image_file) {
            await Validator.validateFile(image_file, {
                allowedTypes: ['image/jpeg', 'image/png'],
                maxSize: 5 * 1024 * 1024, // 5MB
                fieldName: 'image',
            });
        }

        const song = await createSong({
            title,
            artist_id: +artist_id,
            audio_path: 'audios/' + audio_file.filename,
            image: image_file ? 'images/songs/' + image_file.filename : null,
            genre_ids: genre_ids ? JSON.parse(genre_ids) : [],
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
        const { title, artist_id, genre_ids, is_active } = req.body;
        const audio_file = req.files?.audio?.[0];
        const image_file = req.files?.image?.[0];

        // Validate inputs
        await Validator.isNumber(id, { integer: true, min: 1 });
        await Validator.validateNotNull({ title });
        await Validator.isText(title, { minLength: 2, maxLength: 100 });
        if (artist_id) {
            await Validator.isNumber(artist_id, { integer: true, min: 1 });
        }
        if (genre_ids) {
            const parsedGenres = JSON.parse(genre_ids || '[]');
            await Validator.isArray(parsedGenres, { minLength: 0, maxLength: 10, arrayName: "genre_ids" });
            for (const id of parsedGenres) {
                await Validator.isNumber(id, { integer: true, min: 1 });
            }
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
                artist_id: artist_id ? +artist_id : undefined,
                audio_path: audio_file ? 'audios/' + audio_file.filename : undefined,
                image: image_file ? 'images/songs/' + image_file.filename : undefined,
                genre_ids: genre_ids ? JSON.parse(genre_ids) : undefined,
                is_active: is_active !== undefined ? is_active : undefined,
            },
        });

        return res.status(OK_STATUS).json(updatedSong);
    }
);