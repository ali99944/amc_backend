// statistics_route.js
import express from 'express';
import { getOverviewStatisticsController } from '../controllers/statistics_controller.js';
import { verifyManagerToken } from '../middlewares/manager_auth_middleware.js';

const router = express.Router();

// Manager-only route
router.get('/statistics/overview', verifyManagerToken, getOverviewStatisticsController);

router.get('/statistics/engagement', verifyManagerToken, );
router.get('/statistics/content', verifyManagerToken, );

export default router;
