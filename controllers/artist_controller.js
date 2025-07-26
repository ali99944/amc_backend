// artist_controller.js
import { ApiError } from "../lib/api_error.js";
import { BAD_REQUEST_CODE } from "../lib/error_codes.js";
import { parseBoolean } from "../lib/parser.js";
import { BAD_REQUEST_STATUS, OK_STATUS } from "../lib/status_codes.js";
import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { createArtist, deleteArtist, followArtist, getAllArtists, getArtistProfile, getFollowedArtists, isUserFollowingArtist, unfollowArtist, updateArtist } from "../services/artist_service.js";

export const getAllArtistsController = asyncWrapper(
    async (_, res) => {
        const artists = await getAllArtists();
        return res.status(OK_STATUS).json(artists);
    }
);

export const createArtistController = asyncWrapper(
    async (req, res, next) => {
        const { name, bio, is_featured, genre_ids } = req.body;
        const image_file = req.file;

        // Validate inputs
        if (!image_file) {
            const image_missing_error = new ApiError("Image is required", BAD_REQUEST_CODE, BAD_REQUEST_STATUS);
            return next(image_missing_error);
        }

        await Validator.validateNotNull({ name });
        await Validator.isText(name, { minLength: 2, maxLength: 100 });
        if (bio) {
            await Validator.isText(bio, { minLength: 0, maxLength: 1000 });
        }
        // if (is_featured !== undefined) {
        //     await Validator.isEnum(is_featured, [true, false], "is_featured must be a boolean");
        // }
        if (genre_ids) {
            const parsedGenres = JSON.parse(genre_ids || '[]');
            await Validator.isArray(parsedGenres, { minLength: 0, maxLength: 10, arrayName: "genre_ids" });
            for (const id of parsedGenres) {
                await Validator.isNumber(id, { integer: true, min: 1 });
            }
        }

        const artist = await createArtist({
            name,
            bio: bio || '',
            image: 'images/artists/' + image_file.filename,
            is_featured: parseBoolean(is_featured),
            genre_ids: genre_ids ? JSON.parse(genre_ids) : [],
        });

        return res.status(OK_STATUS).json(artist);
    }
);

export const deleteArtistController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        await Validator.isNumber(id, { integer: true, min: 1 });
        const deletedArtist = await deleteArtist(id);
        return res.status(OK_STATUS).json(deletedArtist);
    }
);

export const updateArtistController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        const { name, bio, is_featured, is_active, genre_ids } = req.body;
        const image_file = req.file;

        // Validate inputs
        await Validator.isNumber(id, { integer: true, min: 1 });
        await Validator.validateNotNull({ name });
        await Validator.isText(name, { minLength: 2, maxLength: 100 });
        if (bio) {
            await Validator.isText(bio, { minLength: 0, maxLength: 1000 });
        }
        if (is_featured !== undefined) {
            await Validator.isEnum(parseBoolean(is_featured), [true, false], "is_featured must be a boolean");
        }
        if (is_active !== undefined) {
            await Validator.isEnum(parseBoolean(is_active), [true, false], "is_active must be a boolean");
        }
        if (genre_ids) {
            const parsedGenres = JSON.parse(genre_ids || '[]');
            await Validator.isArray(parsedGenres, { minLength: 0, maxLength: 10, arrayName: "genre_ids" });
            for (const id of parsedGenres) {
                await Validator.isNumber(id, { integer: true, min: 1 });
            }
        }

        const updatedArtist = await updateArtist({
            id,
            payload: {
                name,
                bio: bio || undefined,
                image: image_file ? 'images/artists/' + image_file.filename : undefined,
                is_featured: is_featured !== undefined ? parseBoolean(is_featured) : undefined,
                is_active: is_active !== undefined ? parseBoolean(is_active) : undefined,
                genre_ids: genre_ids ? JSON.parse(genre_ids) : undefined,
            },
        });

        return res.status(OK_STATUS).json(updatedArtist);
    }
);



export const getArtistProfileController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params;
        
        const result = await getArtistProfile(id);
        return res.status(OK_STATUS).json(result);
    }
);


export const followArtistController = asyncWrapper(
    async (req, res, next) => {
        const user_id = req.user.id;
        const { id: artist_id } = req.params;


        console.log('inside follow logic');
        
        try {
            // await Validator.isNumber(artist_id, { integer: true, min: 1 });
            const result = await followArtist({ user_id, artist_id });
            return res.status(OK_STATUS).json(result);
        } catch (err) {
            return next(new ApiError(err.message, BAD_REQUEST_CODE, BAD_REQUEST_STATUS));
        }
    }
);

export const unfollowArtistController = asyncWrapper(
    async (req, res, next) => {
        const user_id = req.user.id;
        const { id: artist_id } = req.params;

        console.log('inside unfollow logic');
        try {
            // await Validator.isNumber(artist_id, { integer: true, min: 1 });
            const result = await unfollowArtist({ user_id, artist_id });
            return res.status(OK_STATUS).json(result);
        } catch (err) {
            return next(new ApiError(err.message, BAD_REQUEST_CODE, BAD_REQUEST_STATUS));
        }
    }
);

export const isUserFollowingArtistController = asyncWrapper(
    async (req, res, next) => {
        const user_id = req.user.id;
        const { id: artist_id } = req.params;

        console.log('inside folllllllllll');
        
        
        try {
            // await Validator.isNumber(artist_id, { integer: true, min: 1 });
            const result = await isUserFollowingArtist({ user_id, artist_id });
            console.log(`result is ${result}`);
            
            return res.status(OK_STATUS).json(result);
        } catch (err) {
            return next(new ApiError(err.message, BAD_REQUEST_CODE, BAD_REQUEST_STATUS));
        }
    }
);


export const getFollowedArtistsController = asyncWrapper(
    async (req, res) => {
        const user_id = req.user.id;
        const followedArtists = await getFollowedArtists(user_id);
        return res.status(OK_STATUS).json(followedArtists);
    }
);
