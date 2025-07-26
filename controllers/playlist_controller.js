// src/controllers/playlist_controller.js

import Validator from "../lib/validator.js";
import asyncWrapper from "../lib/wrappers/async_wrapper.js";
import { OK_STATUS, CREATED_STATUS } from "../lib/status_codes.js";
import * as playlistService from "../services/playlist_service.js";

export const getUserPlaylistsController = asyncWrapper(async (req, res) => {
    const user_id = req.user.id;
    const playlists = await playlistService.getUserPlaylists(user_id);
    
    res.status(OK_STATUS).json(playlists);
});

export const getSystemPlaylistsController = asyncWrapper(async (req, res) => {
    const { source } = req.query;
    if (source) {
        await Validator.isEnum(source, ['curated', 'recommended', 'trending', 'ai', 'editorial']);
    }
    const playlists = await playlistService.getSystemPlaylists(source);
    res.status(OK_STATUS).json(playlists);
});

export const getPlaylistDetailsController = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Validator.isNumber(id);
    const playlist = await playlistService.getPlaylistDetails(id);
    res.status(OK_STATUS).json(playlist);
});

export const createUserPlaylistController = asyncWrapper(async (req, res) => {
    const { name, description, songs_list } = req.body;
    const userId = req.user.id; // Get user from auth middleware

    await Validator.validateNotNull({ name });
    await Validator.isText(name, { minLength: 1, maxLength: 100 });
    if (description) await Validator.isText(description, { maxLength: 500 });

    const playlist = await playlistService.createUserPlaylist({ name, description, userId, songs_list: songs_list ?? [] });
    res.status(CREATED_STATUS).json(playlist);
});

export const addSongToPlaylistController = asyncWrapper(async (req, res) => {
    const { id: playlistId } = req.params;
    const { song_id } = req.body;

    await Validator.isNumber(playlistId);
    await Validator.isNumber(song_id);
    
    await playlistService.addSongToPlaylist(playlistId, song_id);
    res.status(CREATED_STATUS).json({ message: "Song added successfully." });
});

export const removeSongFromPlaylistController = asyncWrapper(async (req, res) => {
    const { id: playlistId, songId } = req.params;
    await Validator.isNumber(playlistId);
    await Validator.isNumber(songId);

    await playlistService.removeSongFromPlaylist(playlistId, songId);
    res.status(OK_STATUS).json({ message: "Song removed successfully." });
});

export const updatePlaylistMetadataController = asyncWrapper(async (req, res) => {
    const { id: playlistId } = req.params;
    // const user_id = req.user.id;
    const { name, description } = req.body;
    const image = req.file;

    const image_source = image != null ? 'images/playlists/' + image.filename : undefined

    if (name) await Validator.isText(name, { minLength: 1, maxLength: 100 });
    if (description) await Validator.isText(description, { maxLength: 500 });

    const updatedPlaylist = await playlistService.updatePlaylistMetadata(playlistId, { name, description, image: image_source });
    res.status(OK_STATUS).json(updatedPlaylist);
});

export const deleteUserPlaylistController = asyncWrapper(async (req, res) => {
    const { id: playlistId } = req.params;
    const userId = req.user.id;

    await Validator.isNumber(playlistId);
    await playlistService.deleteUserPlaylist(playlistId, userId);
    res.status(OK_STATUS).json({ message: "Playlist deleted successfully." });
});

export const regeneratePlaylistController = asyncWrapper(async (req, res) => {
    const { id: playlistId } = req.body; // Or req.params depending on your route
    await Validator.isNumber(playlistId);
    const result = await playlistService.regeneratePlaylist(playlistId);
    res.status(OK_STATUS).json(result);
});

// --- Personalization Controllers ---
export const getForYouPlaylistsController = asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const playlists = await playlistService.getForYouPlaylists(userId);
    res.status(OK_STATUS).json(playlists);
});

export const getLikedSongsPlaylistController = asyncWrapper(
    async (req, res) => {
        const user_id = req.user.id;
        const playlist = await playlistService.getLikedSongsPlaylist(user_id);
       
        
        console.log('gottttttttttttttt');
        
        res.status(OK_STATUS).json(playlist);
    }
);


export const getRecentPlayedSongsPlaylistController = asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const playlist = await playlistService.getRecentPlayedSongsPlaylist(userId);
    
    res.status(OK_STATUS).json(playlist);
});

export const getDailyMixPlaylistController = asyncWrapper(async (req, res) => {
    const userId = req.user.id;
    const playlist = await playlistService.getDailyMixPlaylist(userId);
    res.status(OK_STATUS).json(playlist);
});


export const getPlaylistSongsController = asyncWrapper(async (req, res) => {
    const { id: playlistId } = req.params;
    await Validator.isNumber(playlistId);
    
    const songs = await playlistService.getPlaylistSongs(playlistId);
    res.status(OK_STATUS).json(songs);
});
