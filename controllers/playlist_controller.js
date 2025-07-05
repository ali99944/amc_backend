// playlist_controller.js
import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";
import { BAD_REQUEST_STATUS, OK_STATUS } from "../lib/status_codes.js";
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { createPlaylist, deletePlaylist, getAllPlaylists, updatePlaylist } from "../services/playlist_service.js";

export const getAllPlaylistsController = asyncWrapper(
    async (_, res) => {
        const playlists = await getAllPlaylists();
        return res.status(OK_STATUS).json(playlists);
    }
);

export const createPlaylistController = asyncWrapper(
    async (req, res, next) => {
        const { name, description, user_id, song_ids } = req.body;
        const image_file = req.file;

        // Validate inputs
        await Validator.validateNotNull({ name, user_id });
        await Validator.isText(name, { minLength: 2, maxLength: 100 });
        await Validator.isNumber(user_id, { integer: true, min: 1 });
        if (description) {
            await Validator.isText(description, { minLength: 0, maxLength: 500 });
        }
        if (song_ids) {
            const parsedSongs = JSON.parse(song_ids || '[]');
            await Validator.isArray(parsedSongs, { minLength: 0, maxLength: 50, arrayName: "song_ids" });
            for (const id of parsedSongs) {
                await Validator.isNumber(id, { integer: true, min: 1 });
            }
        }
        if (image_file) {
            await Validator.validateFile(image_file, {
                allowedTypes: ['image/jpeg', 'image/png'],
                maxSize: 5 * 1024 * 1024, // 5MB
                fieldName: 'image',
            });
        }

        const playlist = await createPlaylist({
            name,
            description: description || null,
            image: image_file ? 'images/playlists/' + image_file.filename : null,
            user_id: +user_id,
            song_ids: song_ids ? JSON.parse(song_ids) : [],
        });

        return res.status(OK_STATUS).json(playlist);
    }
);

export const deletePlaylistController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        await Validator.isNumber(id, { integer: true, min: 1 });
        const deletedPlaylist = await deletePlaylist(id);
        return res.status(OK_STATUS).json(deletedPlaylist);
    }
);

export const updatePlaylistController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        const { name, description, user_id, song_ids, is_active } = req.body;
        const image_file = req.file;

        // Validate inputs
        await Validator.isNumber(id, { integer: true, min: 1 });
        await Validator.validateNotNull({ name });
        await Validator.isText(name, { minLength: 2, maxLength: 100 });
        if (user_id) {
            await Validator.isNumber(user_id, { integer: true, min: 1 });
        }
        if (description) {
            await Validator.isText(description, { minLength: 0, maxLength: 500 });
        }
        if (song_ids) {
            const parsedSongs = JSON.parse(song_ids || '[]');
            await Validator.isArray(parsedSongs, { minLength: 0, maxLength: 50, arrayName: "song_ids" });
            for (const id of parsedSongs) {
                await Validator.isNumber(id, { integer: true, min: 1 });
            }
        }
        if (is_active !== undefined) {
            await Validator.isEnum(is_active, [true, false], "is_active must be a boolean");
        }
        if (image_file) {
            await Validator.validateFile(image_file, {
                allowedTypes: ['image/jpeg', 'image/png'],
                maxSize: 5 * 1024 * 1024,
                fieldName: 'image',
            });
        }

        const updatedPlaylist = await updatePlaylist({
            id,
            payload: {
                name,
                description: description || undefined,
                image: image_file ? 'images/playlists/' + image_file.filename : undefined,
                user_id: user_id ? +user_id : undefined,
                song_ids: song_ids ? JSON.parse(song_ids) : undefined,
                is_active: is_active !== undefined ? is_active : undefined,
            },
        });

        return res.status(OK_STATUS).json(updatedPlaylist);
    }
);
