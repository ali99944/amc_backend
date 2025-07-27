import express from 'express';
import { addSongToFavoritesController, checkSongFavoriteController, checkSongLikeController, createSongController, deleteSongController, getAllSongsController, getRecommendedSongsController, getSongByIdController, getTopSongsController, likeSongController, recordSongPlayController, removeSongFromFavoritesController, searchSongsController, unlikeSongController, updateSongController } from '../controllers/song_controller.js';
import { createMulterStorage } from '../services/multer_storage.js';
import { verifyUserTokenMiddleware } from '../middlewares/user_auth_middleware.js';

// song_route.js
const router = express.Router();

// Configure multer for both audio and image uploads
const upload = createMulterStorage('songs', 'assets').fields([
  { name: 'audio', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

// --- User Protected Routes
router.get(
  '/songs/:id/check-like',
  verifyUserTokenMiddleware,
  checkSongLikeController
);

router.post(
  '/songs/:id/like',
  verifyUserTokenMiddleware,
  likeSongController
);

router.post(
  '/songs/:id/unlike',
  verifyUserTokenMiddleware,
  unlikeSongController
);

// --- User Protected Routes
router.get(
  '/songs/:id/check-favorite',
  verifyUserTokenMiddleware,
  checkSongFavoriteController
);

router.post(
  '/songs/:id/add-favorite',
  verifyUserTokenMiddleware,
  addSongToFavoritesController
);

router.post(
  '/songs/:id/remove-favorite',
  verifyUserTokenMiddleware,
  removeSongFromFavoritesController
);

router.post(
  '/songs/:id/plays',
  verifyUserTokenMiddleware,
  recordSongPlayController
)

router.get(
  '/songs/top-songs',
  getTopSongsController
)

router.get(
  '/songs/recommendations',
  verifyUserTokenMiddleware,
  getRecommendedSongsController
)


router.get('/songs', getAllSongsController);
router.get('/songs/search', searchSongsController);
router.get('/songs/:id', getSongByIdController);
router.post('/songs', upload, createSongController);
router.put('/songs/:id', upload, updateSongController);
router.delete('/songs/:id', deleteSongController);
export default router;