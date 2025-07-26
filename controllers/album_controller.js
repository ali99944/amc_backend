// src/controllers/album_controller.js

import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { createAlbum, deleteAlbum, getAllAlbums, getAlbumById, updateAlbum, getNewReleases } from "../services/album_service.js";
import { OK_STATUS, CREATED_STATUS } from "../lib/status_codes.js";

export const getAllAlbumsController = asyncWrapper(
    async (req, res) => {
        const albums = await getAllAlbums();
        res.status(OK_STATUS).json(albums);
    }
);

export const getAlbumByIdController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        await Validator.isNumber(id, { integer: true, min: 1 });
        const album = await getAlbumById(id);
        res.status(OK_STATUS).json(album);
    }
);

export const createAlbumController = asyncWrapper(
    async (req, res) => {
        const { name, description, artist_id, release_date, album_type, song_ids, genre_ids } = req.body;
        const image_file = req.file;
        

        // --- Validation ---
        await Validator.validateNotNull({ name, artist_id, release_date, album_type });
        await Validator.isText(name, { minLength: 1, maxLength: 255 });
        if(description) await Validator.isText(description);
        await Validator.isNumber(artist_id, { integer: true, min: 1 });
        await Validator.isDate(release_date);
        await Validator.isEnum(album_type, ['Single', 'EP', 'Album', 'Compilation']);
        
        // Validate that song_ids and genre_ids are arrays of numbers if they exist
        if (song_ids) await Validator.isArrayOfNumbers(song_ids, { integer: true, min: 1 });
        if (genre_ids) await Validator.isArrayOfNumbers(genre_ids, { integer: true, min: 1 });

        // if (image_file) {
        //     await Validator.validateFile(image_file, {
        //         allowedTypes: ['image/jpeg', 'image/png'],
        //         maxSize: 5 * 1024 * 1024, // 5MB
        //         fieldName: 'image',
        //     });
        // }

        const newAlbum = await createAlbum({
            name,
            description,
            image: image_file ? 'images/albums_cover/' + image_file.filename : null,
            artist_id,
            release_date,
            album_type,
            song_ids,
            genre_ids
        });

        res.status(CREATED_STATUS).json(newAlbum);
    }
);

export const updateAlbumController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        await Validator.isNumber(id, { integer: true, min: 1 });
        const image_file = req.file;
        let image = null;
        if (image_file) {
            image = 'images/albums_cover/' + image_file.filename;
        }

        const updatedAlbum = await updateAlbum(id, { ...req.body, image });
        res.status(OK_STATUS).json(updatedAlbum);
    }
);

export const deleteAlbumController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        await Validator.isNumber(id, { integer: true, min: 1 });
        const result = await deleteAlbum(id);
        res.status(OK_STATUS).json(result);
    }
);

export const getNewReleasesController = asyncWrapper(
    async (req, res) => {
        const { limit, days } = req.query;

        // Validate query parameters if provided
        if (limit) await Validator.isNumber(limit, { integer: true, min: 1 });
        if (days) await Validator.isNumber(days, { integer: true, min: 1 });

        const albums = await getNewReleases({ 
            limit: limit ? +limit : undefined,
            days: days ? +days : undefined
        });

        
        
        res.status(OK_STATUS).json(albums);
    }
);


export const getNewReleasesByGenreController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        const { limit, days } = req.query;

        // Validate genre ID
        await Validator.isNumber(id, { integer: true, min: 1 });

        // Validate query parameters if provided
        if (limit) await Validator.isNumber(limit, { integer: true, min: 1 });
        if (days) await Validator.isNumber(days, { integer: true, min: 1 });

        const albums = await getNewReleasesByGenre(id, {
            limit: limit ? +limit : undefined,
            days: days ? +days : undefined
        });
        
        res.status(OK_STATUS).json(albums);
    }
);
