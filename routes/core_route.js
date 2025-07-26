import { Router } from 'express';
import { getFeaturedArtists, getJumpBackIn, getMadeForYou, getNewReleases, getQuickPicks } from '../controllers/core_controller.js';

const router = Router();

// Define a route for each section
router.get('/quick-picks', getQuickPicks);
router.get('/made-for-you', getMadeForYou);
router.get('/jump-back-in', getJumpBackIn);
router.get('/featured-artists', getFeaturedArtists);
router.get('/new-releases', getNewReleases);

export default router;