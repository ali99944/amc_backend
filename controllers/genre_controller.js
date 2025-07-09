import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";
import { parseBoolean } from "../lib/parser.js";
import { BAD_REQUEST_STATUS, OK_STATUS } from "../lib/status_codes.js";
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { createGenre, deleteGenre, getAllGenres, updateGenre } from "../services/genre_service.js";

export const getAllGenresController = asyncWrapper(
    async (_, res) => {
        const genres = await getAllGenres();
        return res.status(OK_STATUS).json(genres);
    }
);

export const createGenreController = asyncWrapper(
    async (req, res, next) => {
        const { name, description, color } = req.body;
        const image_file = req.file;

        // Validate inputs
        if (!image_file) {
            const image_missing_error = new ApiError("Image is required", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            return next(image_missing_error);
        }

        await Validator.validateNotNull({ name });
        await Validator.isText(name, { minLength: 2, maxLength: 50 });
        if (description) {
            await Validator.isText(description, { minLength: 0, maxLength: 500 });
        }
        if (color) {
            await Validator.isText(color, { pattern: /^#[0-9A-Fa-f]{6}$/, errorMessage: "Color must be a valid hex code (e.g., #FF0000)" });
        }

        const genre = await createGenre({
            name,
            description: description || '',
            image: 'images/genres/' + image_file.filename,
            color: color || '#000000',
        });

        return res.status(OK_STATUS).json(genre);
    }
);

export const deleteGenreController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        await Validator.isNumber(id, { integer: true, min: 1 });
        const deletedGenre = await deleteGenre(id);
        return res.status(OK_STATUS).json(deletedGenre);
    }
);

export const updateGenreController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        const { name, description, color, is_active } = req.body;
        const image_file = req.file;

        // Validate inputs
        await Validator.isNumber(id, { integer: true, min: 1 });
        await Validator.validateNotNull({ name });
        await Validator.isText(name, { minLength: 2, maxLength: 50 });
        if (description) {
            await Validator.isText(description, { minLength: 0, maxLength: 500 });
        }
        if (color) {
            await Validator.isText(color, { pattern: /^#[0-9A-Fa-f]{6}$/, errorMessage: "Color must be a valid hex code (e.g., #FF0000)" });
        }

        
        if (is_active !== undefined) {
            await Validator.isEnum(parseBoolean(is_active), [true, false], "is_active must be a boolean");
        }

        const updatedGenre = await updateGenre({
            id,
            payload: {
                name,
                description: description || undefined,
                image: image_file ? 'images/genres/' + image_file.filename : undefined,
                color: color || undefined,
                is_active: is_active !== undefined ? parseBoolean(is_active) : undefined,
            },
        });

        return res.status(OK_STATUS).json(updatedGenre);
    }
);