import express from 'express';
import { createSongController, deleteSongController, getAllSongsController, getSongByIdController, searchSongsController, updateSongController } from '../controllers/song_controller.js';
import { createMulterStorage } from '../services/multer_storage.js';

// song_route.js
const router = express.Router();

// Configure multer for both audio and image uploads
const upload = createMulterStorage('songs', 'assets').fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

router.get('/songs', getAllSongsController);
router.get('/songs/search', searchSongsController);
router.get('/songs/:id', getSongByIdController);
router.post('/songs', upload, createSongController);
router.put('/songs/:id', upload, updateSongController);
router.delete('/songs/:id', deleteSongController);

export default router;