// manager_route.js
import express from 'express';
import { createManagerController, deleteManagerController, getAllManagersController, updateManagerController } from '../controllers/manager_controller.js';
import { getCurrentManagerController, loginManagerController, logoutManagerController, refreshTokenController, verifyManagerTokenController } from '../controllers/manager_auth_controller.js';
import { verifyManagerToken, restrictTo } from '../middlewares/manager_auth_middleware.js';
import { PERMISSIONS } from '../lib/permissions.js';

const router = express.Router();

// Auth routes (no token required)
router.post('/managers/login', loginManagerController);
router.post('/managers/logout', logoutManagerController);
router.post('/managers/refresh', refreshTokenController);

// Manager CRUD routes (protected)
router.get('/managers', verifyManagerToken, getAllManagersController);
router.post('/managers', verifyManagerToken, restrictTo(PERMISSIONS.MANAGER.CREATE), createManagerController);
router.put('/managers/:id', verifyManagerToken, restrictTo(PERMISSIONS.MANAGER.UPDATE), updateManagerController);
router.delete('/managers/:id', verifyManagerToken, restrictTo(PERMISSIONS.MANAGER.DELETE), deleteManagerController);

// Manager protected routes
router.get('/managers/verify-token', verifyManagerTokenController)
router.get('/managers/me', getCurrentManagerController)
export default router;