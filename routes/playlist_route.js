import express from "express";
import { createPlaylistController, deletePlaylistController, getAllPlaylistsController, getPlaylistController, updatePlaylistController } from "../controllers/playlist_controller.js";

const router = express.Router();

router.get('/playlists', getAllPlaylistsController);
router.get('/playlists/:id', getPlaylistController);
router.post('/playlists', createPlaylistController);
router.put('/playlists/:id', updatePlaylistController);
router.delete('/playlists/:id', deletePlaylistController);

export default router;