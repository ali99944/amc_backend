// src/controllers/manager_playlist_controller.js

import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { OK_STATUS, CREATED_STATUS } from "../lib/status_codes.js";
import * as managerPlaylistService from "../services/manager_playlist_service.js";

export const getAllPlaylistsAsManagerController = asyncWrapper(async (req, res) => {
    const playlists = await managerPlaylistService.getAllPlaylistsAsManager();
    
    res.status(OK_STATUS).json(playlists);
});

export const createSystemPlaylistController = asyncWrapper(
    async (req, res) => {
        const { name, description, image, source, song_ids } = req.body;
        console.log(req.body);
        
        
    
        await Validator.validateNotNull({ name, source });
        await Validator.isText(name, { minLength: 1, maxLength: 100 });
        await Validator.isEnum(source, ['curated', 'editorial', 'trending']); // Manager can only create these types
        // if (song_ids) await Validator.isArrayOfNumbers(song_ids);
    
        const playlist = await managerPlaylistService.createSystemPlaylist({ name, description, image, source, song_ids });
        res.status(CREATED_STATUS).json(playlist);
    }
);

export const updatePlaylistAsManagerController = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Validator.isNumber(id);
    const updatedPlaylist = await managerPlaylistService.updatePlaylistAsManager(id, req.body);
    res.status(OK_STATUS).json(updatedPlaylist);
});

export const deletePlaylistAsManagerController = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Validator.isNumber(id);
    await managerPlaylistService.deletePlaylistAsManager(id);
    res.status(OK_STATUS).json({ message: "Playlist deleted successfully." });
});