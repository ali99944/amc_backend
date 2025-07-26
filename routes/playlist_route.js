// src/routes/playlist_route.js

import express from 'express';
import * as playlistController from '../controllers/playlist_controller.js';
import { verifyUserTokenMiddleware } from '../middlewares/user_auth_middleware.js';
import { createMulterStorage } from '../services/multer_storage.js';

const router = express.Router();

// --- Public or Semi-Public Routes ---
// Get system playlists (e.g., curated, trending)
router.get('/playlists/system', playlistController.getSystemPlaylistsController);
// Get playlists for a specific user (could be public for profiles)
router.get(
    '/playlists', 
    verifyUserTokenMiddleware,
    playlistController.getUserPlaylistsController
);


// --- Personalized Routes (Requires Authentication) ---
// router.get('/playlists/for-you', verifyUserTokenMiddleware, playlistController.getForYouPlaylistsController);
router.get('/playlists/liked', verifyUserTokenMiddleware, playlistController.getLikedSongsPlaylistController);
router.get('/playlists/daily-mix', verifyUserTokenMiddleware, playlistController.getDailyMixPlaylistController);
router.get('/playlists/recent', verifyUserTokenMiddleware, playlistController.getRecentPlayedSongsPlaylistController);


// Get details of a single playlist
router.get('/playlists/:id', playlistController.getPlaylistDetailsController);

// --- User Action Routes (Requires Authentication) ---
// Create a new playlist for the logged-in user
router.post('/playlists', verifyUserTokenMiddleware, playlistController.createUserPlaylistController);
// Update metadata of a playlist owned by the logged-in user
router.put(
    '/playlists/:id', 
    verifyUserTokenMiddleware,
    createMulterStorage('images', 'playlists').single('image'),
    playlistController.updatePlaylistMetadataController
);
// Delete a playlist owned by the logged-in user
router.delete('/playlists/:id', verifyUserTokenMiddleware, playlistController.deleteUserPlaylistController);
// Add a song to a playlist
router.post('/playlists/:id/songs', playlistController.addSongToPlaylistController);
router.get('/playlists/:id/songs', playlistController.getPlaylistSongsController);
// Remove a song from a playlist
router.delete('/playlists/:id/songs/:songId', verifyUserTokenMiddleware, playlistController.removeSongFromPlaylistController);


// --- System/AI Routes (May require special admin/system permissions) ---
router.post('/playlists/regenerate', verifyUserTokenMiddleware, /* restrictTo('SYSTEM'), */ playlistController.regeneratePlaylistController);


export default router;