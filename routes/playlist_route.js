import express from 'express';
import { createPlaylistController, deletePlaylistController, getAllPlaylistsController, updatePlaylistController } from '../controllers/playlist_controller.js';
import { createMulterStorage } from '../services/multer_storage.js';

// playlist_route.js
const router = express.Router();

router.get('/playlists', getAllPlaylistsController);
router.post('/playlists', createMulterStorage('images', 'playlists').single('image'), createPlaylistController);
router.put('/playlists/:id', createMulterStorage('images', 'playlists').single('image'), updatePlaylistController);
router.delete('/playlists/:id', deletePlaylistController);

export default router;