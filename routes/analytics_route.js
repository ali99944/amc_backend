// analytics_route.js
import express from 'express';
import { getSongPlaysAnalyticsController, getUserActivityAnalyticsController, getRetentionAnalyticsController } from '../controllers/analytics_controller.js';
import { verifyManagerToken } from '../middlewares/manager_auth_middleware.js';

const router = express.Router();

// Manager-only routes
router.get('/analytics/song-plays', verifyManagerToken, getSongPlaysAnalyticsController);
router.get('/analytics/user-activity', verifyManagerToken, getUserActivityAnalyticsController);
router.get('/analytics/retention', verifyManagerToken, getRetentionAnalyticsController);

export default router;