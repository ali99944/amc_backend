import { BAD_REQUEST_STATUS, OK_STATUS } from "../lib/status_codes.js"
import Validator from "../lib/validator.js"
import asyncWrapper from "../lib/wrappers/async_wrapper.js"
import { createGenre, deleteGenre, getAllGenres, updateGenre } from "../services/genre_service.js"
import CustomError from "../utils/custom_error.js"


export const getAllGenresController = asyncWrapper(
    async (_, res) => {
        const genres = await getAllGenres()
        console.log(genres);
        
        return res.status(OK_STATUS).json(genres)
    }
)

export const createGenreController = asyncWrapper(
    async (req,res,next) => {
        const { name } = req.body
        const image_file = req.file

        if(!image_file) {
            const image_missing_error = new CustomError("Image is required", BAD_REQUEST_STATUS)
            return next(image_missing_error)
        }
        await Validator.validateNotNull({ name })        


        const genre = await createGenre({
            name, image: 'images/genres/' + image_file.filename
        })

        return res.status(OK_STATUS).json(genre)
    }
)

export const deleteGenreController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        await deleteGenre(id)
        return res.status(OK_STATUS).json({ success: true })
    }
)

export const updateGenreController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { name } = req.body
        let image
        if(req.file) {
            image = req.file.path
        }
        await updateGenre({
            id, 
            payload: { name, image: image ?? null }
        })
        return res.status(OK_STATUS).json({ success: true })
    }
)