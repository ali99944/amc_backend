// user_playlist_route.js
import express from 'express';
import { createUserPlaylistController, renameUserPlaylistController, addSongsToUserPlaylistController, copySystemPlaylistController, getUserPlaylistsController, deleteUserPlaylistController } from '../controllers/user_playlist_controller.js';
import { createMulterStorage } from '../services/multer_storage.js';
import { verifyUserTokenMiddleware } from '../middlewares/user_auth_middleware.js';

const router = express.Router();

// User playlist routes (protected)
router.get('/user-playlists', verifyUserTokenMiddleware, getUserPlaylistsController);
router.post('/user-playlists', verifyUserTokenMiddleware, createMulterStorage('images', 'user-playlists').single('image'), createUserPlaylistController);
router.put('/user-playlists/:id/rename', verifyUserTokenMiddleware, renameUserPlaylistController);
router.post('/user-playlists/:id/songs', verifyUserTokenMiddleware, addSongsToUserPlaylistController);
router.post('/user-playlists/copy/:playlistId', verifyUserTokenMiddleware, copySystemPlaylistController);
router.delete('/user-playlists/:id', verifyUserTokenMiddleware, deleteUserPlaylistController);

export default router;
