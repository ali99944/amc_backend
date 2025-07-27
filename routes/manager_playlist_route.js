// src/routes/manager_playlist_route.js

import express from 'express';
import * as managerPlaylistController from '../controllers/manager_playlist_controller.js';
import { verifyManagerToken, restrictTo } from '../middlewares/manager_auth_middleware.js';
import { PERMISSIONS } from '../lib/permissions.js';
import { createMulterStorage } from '../services/multer_storage.js';

const router = express.Router();

// Base path for these routes will be something like /api/manager

// Get all playlists (user and system) for viewing in the dashboard
router.get(
    '/system/playlists',
    verifyManagerToken,
    restrictTo(PERMISSIONS.PLAYLIST.READ),
    managerPlaylistController.getAllPlaylistsAsManagerController
);

// Create a new system playlist (e.g., editorial)
router.post(
    '/system/playlists',
    verifyManagerToken,
    // restrictTo(PERMISSIONS.PLAYLIST.CREATE),
    createMulterStorage('images', 'playlists').single('image'),
    managerPlaylistController.createSystemPlaylistController
);

// Update ANY playlist (user or system)
router.put(
    '/system/playlists/:id',
    verifyManagerToken,
    restrictTo(PERMISSIONS.PLAYLIST.UPDATE),
    managerPlaylistController.updatePlaylistAsManagerController
);

// Delete ANY playlist (user or system)
router.delete(
    '/system/playlists/:id',
    verifyManagerToken,
    restrictTo(PERMISSIONS.PLAYLIST.DELETE),
    managerPlaylistController.deletePlaylistAsManagerController
);

export default router;