import asyncWrapper from "../lib/wrappers/async_wrapper.js"
import CustomError from "../utils/custom_error.js"
import { BAD_REQUEST_STATUS, OK_STATUS } from "../lib/status_codes.js"
import Validator from "../lib/validator.js"
import { createPlaylist, deletePlaylist, getAllPlaylists, getPlaylist } from "../services/artist_service.js"

export const getAllPlaylistsController = asyncWrapper(
    async (_, res) => {
        const playlists = await getAllPlaylists()
        return res.status(OK_STATUS).json(playlists)
    }
)

export const getPlaylistController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const playlist = await getPlaylist(id)
        if(!playlist) {
            const playlist_not_found_error = new CustomError("Playlist not found", BAD_REQUEST_STATUS)
            return next(playlist_not_found_error)
        }
        return res.status(OK_STATUS).json(playlist)
    }
)

export const createPlaylistController = asyncWrapper(
    async (req, res) => {
        const { title, description, cover_image, is_public } = req.body
        await Validator.validateNotNull({ title, description, cover_image })
        await Validator.validateBoolean({ is_public })

        const playlist = await createPlaylist({
            title, description, cover_image, is_public
        })
        return res.status(CREATED).json(playlist)
    }
)

export const updatePlaylistController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        const { title, description, cover_image, is_public } = req.body
        await Validator.validateNotNull({ title, description, cover_image })
        await Validator.validateBoolean({ is_public })

        await updatePlaylist({
            id,
            payload: { title, description, cover_image, is_public }
        })
        return res.status(OK_STATUS).json({ success: true })
    }
)

export const deletePlaylistController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        await deletePlaylist(id)
        return res.status(OK_STATUS).json({ success: true })
    }
)
