// recommendations_route.js
import express from 'express';
import { getSongRecommendationsController, getPlaylistRecommendationsController } from '../controllers/recommendations_controller.js';
import { verifyUserTokenMiddleware } from '../middlewares/user_auth_middleware.js';

const router = express.Router();

// User-only routes
router.get('/recommendations/songs', verifyUserTokenMiddleware, getSongRecommendationsController);
router.get('/recommendations/playlists', verifyUserTokenMiddleware, getPlaylistRecommendationsController);

export default router;