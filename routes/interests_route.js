import express from 'express';
import {
  addGenreInterestsController,
  removeGenreInterestController,
  getGenreInterestsController,
  addArtistInterestsController,
  removeArtistInterestController,
  getArtistInterestsController,
} from '../controllers/interests_controller.js';
import { verifyUserTokenMiddleware } from '../middlewares/user_auth_middleware.js';

const router = express.Router();

// Interests: Genres
router.post('/interests/genres', verifyUserTokenMiddleware, addGenreInterestsController);
router.delete('/interests/genres/:genre_id', verifyUserTokenMiddleware, removeGenreInterestController);
router.get('/interests/genres', verifyUserTokenMiddleware, getGenreInterestsController);

// Interests: Artists
router.post('/interests/artists', verifyUserTokenMiddleware, addArtistInterestsController);
router.delete('/interests/artists/:artist_id', verifyUserTokenMiddleware, removeArtistInterestController);
router.get('/interests/artists', verifyUserTokenMiddleware, getArtistInterestsController);

export default router;