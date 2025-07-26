// src/routes/searchRoutes.ts

import { Router } from 'express';
import { unifiedSearchController } from '../controllers/search_controller.js';

const router = Router();

// Define the single search endpoint
router.get('/search', unifiedSearchController);

export default router;